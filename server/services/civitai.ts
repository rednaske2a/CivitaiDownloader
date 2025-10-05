import axios from "axios";
import type { ModelType, BaseModel } from "@shared/schema";

const CIVITAI_API_BASE = "https://civitai.com/api/v1";

interface CivitAIModelVersion {
  id: number;
  modelId: number;
  name: string;
  baseModel: string;
  downloadUrl: string;
  files: Array<{
    name: string;
    sizeKB: number;
    downloadUrl: string;
  }>;
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  trainedWords: string[];
}

interface CivitAIModel {
  id: number;
  name: string;
  type: string;
  description: string;
  modelVersions: CivitAIModelVersion[];
}

export class CivitAIService {
  private apiKey: string;

  constructor(apiKey: string = "") {
    this.apiKey = apiKey;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {};
  }

  async getModelFromUrl(url: string): Promise<{
    modelId: number;
    versionId?: number;
  } | null> {
    const modelMatch = url.match(/civitai\.com\/models\/(\d+)/);
    const versionMatch = url.match(/modelVersionId=(\d+)/);
    
    if (!modelMatch) return null;
    
    return {
      modelId: parseInt(modelMatch[1]),
      versionId: versionMatch ? parseInt(versionMatch[1]) : undefined,
    };
  }

  async getModelById(modelId: number): Promise<CivitAIModel | null> {
    try {
      const response = await axios.get(`${CIVITAI_API_BASE}/models/${modelId}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching model from CivitAI:", error);
      return null;
    }
  }

  async getModelVersion(versionId: number): Promise<CivitAIModelVersion | null> {
    try {
      const response = await axios.get(`${CIVITAI_API_BASE}/model-versions/${versionId}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching model version from CivitAI:", error);
      return null;
    }
  }

  mapModelType(civitaiType: string): ModelType {
    const typeMap: Record<string, ModelType> = {
      "LORA": "LORA",
      "Checkpoint": "Checkpoint",
      "TextualInversion": "TextualInversion",
      "Hypernetwork": "Hypernetwork",
      "AestheticGradient": "AestheticGradient",
      "Controlnet": "Controlnet",
      "Poses": "Poses",
    };
    return typeMap[civitaiType] || "LORA";
  }

  mapBaseModel(civitaiBaseModel: string): BaseModel {
    const normalized = civitaiBaseModel.toLowerCase();
    
    if (normalized.includes("sdxl") || normalized.includes("xl")) return "SDXL 1.0";
    if (normalized.includes("sd 1.5") || normalized.includes("sd15")) return "SD 1.5";
    if (normalized.includes("pony")) return "Pony";
    if (normalized.includes("illustrious")) return "Illustrious";
    if (normalized.includes("flux")) return "Flux.1";
    
    return "Other";
  }

  async downloadFile(url: string, onProgress?: (progress: number, downloaded: number, total: number) => void): Promise<Buffer> {
    const response = await axios.get(url, {
      headers: this.getHeaders(),
      responseType: "arraybuffer",
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress(progress, progressEvent.loaded, progressEvent.total);
        }
      },
    });
    
    return Buffer.from(response.data);
  }
}
