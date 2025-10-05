import { storage } from "../storage";
import { CivitAIService } from "./civitai";
import type { DownloadTask, Model } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";
import { EventEmitter } from "events";

export class DownloadManager extends EventEmitter {
  private civitaiService: CivitAIService;
  private activeDownloads: Map<string, boolean> = new Map();
  private downloadInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.civitaiService = new CivitAIService();
    this.startProcessingQueue();
  }

  updateApiKey(apiKey: string) {
    this.civitaiService.setApiKey(apiKey);
  }

  private startProcessingQueue() {
    this.downloadInterval = setInterval(async () => {
      const queue = await storage.getDownloadQueue();
      const queuedTasks = queue.filter(t => t.status === "queued");
      const downloadingTasks = queue.filter(t => t.status === "downloading");

      if (downloadingTasks.length < 2 && queuedTasks.length > 0) {
        const nextTask = queuedTasks[0];
        if (!this.activeDownloads.has(nextTask.id)) {
          this.processDownload(nextTask.id);
        }
      }
    }, 1000);
  }

  async addDownloadFromUrl(url: string): Promise<DownloadTask | null> {
    const parsed = await this.civitaiService.getModelFromUrl(url);
    if (!parsed) return null;

    const model = await this.civitaiService.getModelById(parsed.modelId);
    if (!model) return null;

    let version = model.modelVersions[0];
    if (parsed.versionId) {
      const specificVersion = model.modelVersions.find(v => v.id === parsed.versionId);
      if (specificVersion) version = specificVersion;
    }

    const primaryFile = version.files[0];
    if (!primaryFile) return null;

    const task = await storage.addToQueue({
      modelId: model.id,
      versionId: version.id,
      name: model.name,
      type: this.civitaiService.mapModelType(model.type),
      baseModel: this.civitaiService.mapBaseModel(version.baseModel),
      thumbnailUrl: version.images[0]?.url || "",
      status: "queued",
      progress: 0,
      fileSize: primaryFile.sizeKB * 1024,
      addedAt: new Date().toISOString(),
    });

    this.emit("queue-updated");
    return task;
  }

  private async processDownload(taskId: string) {
    const task = (await storage.getDownloadQueue()).find(t => t.id === taskId);
    if (!task) return;

    this.activeDownloads.set(taskId, true);

    try {
      await storage.updateDownloadTask(taskId, { status: "downloading", progress: 0 });
      this.emit("task-updated", taskId);

      const model = await this.civitaiService.getModelById(task.modelId);
      if (!model) {
        throw new Error("Model not found");
      }

      const version = model.modelVersions.find(v => v.id === task.versionId);
      if (!version) {
        throw new Error("Version not found");
      }

      const settings = await storage.getSettings();
      
      const primaryFile = version.files[0];
      if (!primaryFile) {
        throw new Error("No files available for download");
      }

      let filePath = "";
      const galleryImages: string[] = [];

      if (settings.comfyuiPath && fs.existsSync(settings.comfyuiPath)) {
        try {
          const folderKey = `${task.type}_${task.baseModel.replace(/[.\s]/g, "")}`;
          const folderPath = settings.categoryMappings[folderKey] || path.join("models", task.type.toLowerCase());
          const fullPath = path.join(settings.comfyuiPath, folderPath);

          if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
          }

          // Sanitize filename for Windows - remove invalid characters
          const fileName = primaryFile.name.replace(/[<>:"|?*]/g, "_");
          filePath = path.join(fullPath, fileName);

          const fileBuffer = await this.civitaiService.downloadFile(primaryFile.downloadUrl, (progress, downloaded, total) => {
            const speed = downloaded > 0 ? downloaded / ((Date.now() - Date.parse(task.addedAt)) / 1000) : 0;
            const timeRemaining = speed > 0 ? Math.round((total - downloaded) / speed) : 0;
            
            storage.updateDownloadTask(taskId, {
              progress,
              downloadSpeed: speed,
              timeRemaining,
            });
            this.emit("task-updated", taskId);
          });

          fs.writeFileSync(filePath, fileBuffer);
          console.log(`[Download] Saved model file to: ${filePath}`);

          if (version.images.length > 0) {
            // Sanitize folder name for Windows - remove invalid characters
            const sanitizedModelName = model.name.replace(/[<>:"|?*\/\\]/g, "_").replace(/[^a-z0-9_-]/gi, "_");
            const imagesPath = path.join(fullPath, "gallery", sanitizedModelName);
            if (!fs.existsSync(imagesPath)) {
              fs.mkdirSync(imagesPath, { recursive: true });
            }

            for (let i = 0; i < Math.min(version.images.length, 6); i++) {
              try {
                const imageBuffer = await this.civitaiService.downloadFile(version.images[i].url);
                const imagePath = path.join(imagesPath, `image_${i}.jpg`);
                fs.writeFileSync(imagePath, imageBuffer);
                galleryImages.push(imagePath);
              } catch (err) {
                console.error(`Failed to download gallery image ${i}:`, err);
              }
            }
          }
        } catch (fsError) {
          console.error("[Download] File system error:", fsError);
          throw new Error(`Failed to write files: ${fsError instanceof Error ? fsError.message : "Unknown error"}`);
        }
      } else {
        console.warn("[Download] ComfyUI path not configured or doesn't exist, simulating download");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        for (let i = 0; i <= 100; i += 10) {
          await storage.updateDownloadTask(taskId, {
            progress: i,
            downloadSpeed: 5242880,
            timeRemaining: Math.round((100 - i) / 10),
          });
          this.emit("task-updated", taskId);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Use path.join for cross-platform compatibility even in simulated mode
        const sanitizedModelName = model.name.replace(/[^a-z0-9]/gi, "_");
        filePath = path.join("simulated", "path", task.type.toLowerCase(), `${sanitizedModelName}.safetensors`);
        galleryImages.push(...version.images.slice(0, 6).map((img, i) => img.url));
      }

      const savedModel = await storage.addModel({
        name: model.name,
        type: task.type,
        baseModel: task.baseModel,
        description: model.description || "",
        activationTags: version.trainedWords || [],
        thumbnailUrl: version.images[0]?.url || "",
        fileSize: primaryFile.sizeKB * 1024,
        filePath,
        civitaiUrl: `https://civitai.com/models/${model.id}`,
        civitaiId: model.id,
        versionId: version.id,
        downloadedAt: new Date().toISOString(),
        galleryImages,
      });

      await storage.updateDownloadTask(taskId, { status: "completed", progress: 100 });
      this.emit("task-completed", taskId, savedModel);
      
      setTimeout(async () => {
        await storage.removeFromQueue(taskId);
        this.emit("queue-updated");
      }, 3000);

    } catch (error) {
      console.error(`Download failed for task ${taskId}:`, error);
      await storage.updateDownloadTask(taskId, {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      this.emit("task-failed", taskId);
    } finally {
      this.activeDownloads.delete(taskId);
    }
  }

  async cancelDownload(taskId: string): Promise<boolean> {
    this.activeDownloads.delete(taskId);
    const removed = await storage.removeFromQueue(taskId);
    if (removed) {
      this.emit("queue-updated");
    }
    return removed;
  }

  async clearQueue(): Promise<void> {
    this.activeDownloads.clear();
    await storage.clearQueue();
    this.emit("queue-updated");
  }

  destroy() {
    if (this.downloadInterval) {
      clearInterval(this.downloadInterval);
    }
  }
}

export const downloadManager = new DownloadManager();
