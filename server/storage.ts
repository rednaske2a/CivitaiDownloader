import type { Model, DownloadTask, AppSettings, StorageStats, ModelType, BaseModel } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Settings
  getSettings(): Promise<AppSettings>;
  updateSettings(settings: Partial<AppSettings>): Promise<AppSettings>;
  
  // Models
  getModels(): Promise<Model[]>;
  getModelById(id: string): Promise<Model | undefined>;
  addModel(model: Omit<Model, "id">): Promise<Model>;
  deleteModel(id: string): Promise<boolean>;
  
  // Download Queue
  getDownloadQueue(): Promise<DownloadTask[]>;
  addToQueue(task: Omit<DownloadTask, "id">): Promise<DownloadTask>;
  updateDownloadTask(id: string, updates: Partial<DownloadTask>): Promise<DownloadTask | undefined>;
  removeFromQueue(id: string): Promise<boolean>;
  clearQueue(): Promise<void>;
  
  // Statistics
  getStorageStats(): Promise<StorageStats>;
}

export class MemStorage implements IStorage {
  private settings: AppSettings;
  private models: Map<string, Model>;
  private downloadQueue: Map<string, DownloadTask>;

  constructor() {
    this.settings = {
      civitaiApiKey: "",
      comfyuiPath: "",
      categoryMappings: {
        "LORA_Illustrious": "models/loras/Illustrious",
        "LORA_SDXL": "models/loras/SDXL",
        "LORA_SD15": "models/loras/SD15",
        "LORA_Pony": "models/loras/Pony",
        "LORA_Flux": "models/loras/Flux",
        "Checkpoint_SDXL": "models/checkpoints/SDXL",
        "Checkpoint_SD15": "models/checkpoints/SD15",
        "Checkpoint_Pony": "models/checkpoints/Pony",
        "Checkpoint_Flux": "models/checkpoints/Flux",
        "TextualInversion": "models/embeddings",
        "Hypernetwork": "models/hypernetworks",
        "AestheticGradient": "models/aesthetic_gradients",
        "Controlnet": "models/controlnet",
        "Poses": "models/poses",
      },
    };
    this.models = new Map();
    this.downloadQueue = new Map();
  }

  async getSettings(): Promise<AppSettings> {
    return { ...this.settings };
  }

  async updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    this.settings = { ...this.settings, ...updates };
    return { ...this.settings };
  }

  async getModels(): Promise<Model[]> {
    return Array.from(this.models.values());
  }

  async getModelById(id: string): Promise<Model | undefined> {
    return this.models.get(id);
  }

  async addModel(modelData: Omit<Model, "id">): Promise<Model> {
    const id = randomUUID();
    const model: Model = { ...modelData, id };
    this.models.set(id, model);
    return model;
  }

  async deleteModel(id: string): Promise<boolean> {
    return this.models.delete(id);
  }

  async getDownloadQueue(): Promise<DownloadTask[]> {
    return Array.from(this.downloadQueue.values());
  }

  async addToQueue(taskData: Omit<DownloadTask, "id">): Promise<DownloadTask> {
    const id = randomUUID();
    const task: DownloadTask = { ...taskData, id };
    this.downloadQueue.set(id, task);
    return task;
  }

  async updateDownloadTask(id: string, updates: Partial<DownloadTask>): Promise<DownloadTask | undefined> {
    const task = this.downloadQueue.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.downloadQueue.set(id, updatedTask);
    return updatedTask;
  }

  async removeFromQueue(id: string): Promise<boolean> {
    return this.downloadQueue.delete(id);
  }

  async clearQueue(): Promise<void> {
    this.downloadQueue.clear();
  }

  async getStorageStats(): Promise<StorageStats> {
    const models = Array.from(this.models.values());
    
    const byType: Record<ModelType, { count: number; size: number }> = {
      LORA: { count: 0, size: 0 },
      Checkpoint: { count: 0, size: 0 },
      TextualInversion: { count: 0, size: 0 },
      Hypernetwork: { count: 0, size: 0 },
      AestheticGradient: { count: 0, size: 0 },
      Controlnet: { count: 0, size: 0 },
      Poses: { count: 0, size: 0 },
    };

    const byBaseModel: Record<BaseModel, { count: number; size: number }> = {
      "SD 1.5": { count: 0, size: 0 },
      "SDXL 1.0": { count: 0, size: 0 },
      "Pony": { count: 0, size: 0 },
      "Illustrious": { count: 0, size: 0 },
      "Flux.1": { count: 0, size: 0 },
      "Other": { count: 0, size: 0 },
    };

    let totalSize = 0;

    models.forEach(model => {
      totalSize += model.fileSize;
      
      if (byType[model.type]) {
        byType[model.type].count++;
        byType[model.type].size += model.fileSize;
      }
      
      if (byBaseModel[model.baseModel]) {
        byBaseModel[model.baseModel].count++;
        byBaseModel[model.baseModel].size += model.fileSize;
      }
    });

    return {
      totalSize,
      modelCount: models.length,
      byType,
      byBaseModel,
    };
  }
}

export const storage = new MemStorage();
