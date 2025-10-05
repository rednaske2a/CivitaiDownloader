import * as fs from "fs";
import * as path from "path";
import { storage } from "../storage";
import { CivitAIService } from "./civitai";
import type { ModelType, BaseModel } from "@shared/schema";

export class ModelScanner {
  private civitaiService: CivitAIService;

  constructor() {
    this.civitaiService = new CivitAIService();
  }

  async scanExistingModels(): Promise<void> {
    const settings = await storage.getSettings();
    
    if (!settings.comfyuiPath || !fs.existsSync(settings.comfyuiPath)) {
      console.log("[ModelScanner] ComfyUI path not configured or doesn't exist, skipping scan");
      return;
    }

    if (settings.civitaiApiKey) {
      this.civitaiService.setApiKey(settings.civitaiApiKey);
    }

    console.log("[ModelScanner] Scanning for existing models in:", settings.comfyuiPath);

    const existingModels = await storage.getModels();
    const existingPaths = new Set(existingModels.map(m => m.filePath));

    let scannedCount = 0;
    let newCount = 0;

    for (const [key, folderPath] of Object.entries(settings.categoryMappings)) {
      const fullPath = path.join(settings.comfyuiPath, folderPath);
      
      if (!fs.existsSync(fullPath)) {
        continue;
      }

      const files = fs.readdirSync(fullPath);
      const modelFiles = files.filter(f => 
        f.endsWith('.safetensors') || 
        f.endsWith('.ckpt') || 
        f.endsWith('.pt') || 
        f.endsWith('.pth')
      );

      for (const file of modelFiles) {
        const filePath = path.join(fullPath, file);
        scannedCount++;

        if (existingPaths.has(filePath)) {
          continue;
        }

        try {
          const stats = fs.statSync(filePath);
          const parts = key.split('_');
          const typeStr = parts[0] || 'LORA';
          const baseModelStr = parts.slice(1).join('_') || '';
          
          const type: ModelType = this.parseModelType(typeStr);
          const baseModel: BaseModel = this.parseBaseModel(baseModelStr);

          await storage.addModel({
            name: path.parse(file).name,
            type,
            baseModel,
            description: "Imported from local installation",
            activationTags: [],
            thumbnailUrl: "",
            fileSize: stats.size,
            filePath,
            civitaiUrl: "",
            civitaiId: 0,
            versionId: 0,
            downloadedAt: stats.birthtime.toISOString(),
            galleryImages: [],
          });

          newCount++;
          console.log(`[ModelScanner] Added existing model: ${file}`);
        } catch (error) {
          console.error(`[ModelScanner] Error processing ${file}:`, error);
        }
      }
    }

    console.log(`[ModelScanner] Scan complete. Found ${scannedCount} files, added ${newCount} new models`);
  }

  private parseModelType(typeStr: string): ModelType {
    const validTypes: ModelType[] = ['LORA', 'Checkpoint', 'TextualInversion', 'Hypernetwork', 'AestheticGradient', 'Controlnet', 'Poses'];
    const type = validTypes.find(t => t.toLowerCase() === typeStr.toLowerCase());
    return type || 'LORA';
  }

  private parseBaseModel(baseModelStr: string): BaseModel {
    const normalized = (baseModelStr || '').toLowerCase();
    
    if (normalized.includes('sdxl') || normalized.includes('xl')) return 'SDXL 1.0';
    if (normalized.includes('sd15') || normalized.includes('sd 15')) return 'SD 1.5';
    if (normalized.includes('pony')) return 'Pony';
    if (normalized.includes('illustrious')) return 'Illustrious';
    if (normalized.includes('flux')) return 'Flux.1';
    
    return 'Other';
  }
}

export const modelScanner = new ModelScanner();
