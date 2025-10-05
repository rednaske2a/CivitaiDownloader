import axios from "axios";
import type { ModelType, BaseModel, ImageMetadata } from "@shared/schema";

const CIVITAI_API_BASE = "https://civitai.com/api/v1";

interface CivitAIImage {
  id: number;
  url: string;
  nsfw: boolean;
  nsfwLevel?: number;
  width: number;
  height: number;
  hash: string;
  type: string;
  meta?: {
    prompt?: string;
    negativePrompt?: string;
    seed?: number;
    steps?: number;
    sampler?: string;
    cfgScale?: number;
    clipSkip?: number;
    resources?: Array<{
      id: number;
      name: string;
      type: string;
      weight?: number;
    }>;
  };
  stats?: {
    cryCount: number;
    laughCount: number;
    likeCount: number;
    dislikeCount: number;
    heartCount: number;
    commentCount: number;
  };
}

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
  images: CivitAIImage[];
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

  async getImagesForVersion(
    versionId: number, 
    modelId: number,
    maxImages: number = 100, 
    includeNSFW: boolean = true
  ): Promise<ImageMetadata[]> {
    try {
      const allImages: CivitAIImage[] = [];
      
      const fetchPage = async (nsfw: boolean): Promise<CivitAIImage[]> => {
        const pageImages: CivitAIImage[] = [];
        let cursor: string | undefined = undefined;
        
        while (pageImages.length < maxImages) {
          const params: any = {
            modelId,
            modelVersionId: versionId,
            limit: Math.min(100, maxImages - pageImages.length),
            nsfw: nsfw.toString(),
          };
          
          if (cursor) {
            params.cursor = cursor;
          }
          
          const response = await axios.get(`${CIVITAI_API_BASE}/images`, {
            headers: this.getHeaders(),
            params,
          });
          
          const items = response.data.items || [];
          if (items.length === 0) break;
          
          pageImages.push(...items);
          
          if (pageImages.length >= maxImages) break;
          
          cursor = response.data.metadata?.nextCursor;
          if (!cursor) break;
        }
        
        return pageImages.slice(0, maxImages);
      };

      if (includeNSFW) {
        const [nsfwImages, sfwImages] = await Promise.all([
          fetchPage(true),
          fetchPage(false),
        ]);
        allImages.push(...nsfwImages, ...sfwImages);
      } else {
        const sfwImages = await fetchPage(false);
        allImages.push(...sfwImages);
      }

      const uniqueImages = new Map<number, CivitAIImage>();
      allImages.forEach(img => uniqueImages.set(img.id, img));

      const imagesWithScores: ImageMetadata[] = Array.from(uniqueImages.values()).map(img => {
        const stats = img.stats || {
          cryCount: 0,
          laughCount: 0,
          likeCount: 0,
          dislikeCount: 0,
          heartCount: 0,
          commentCount: 0,
        };
        
        const positiveScore = stats.likeCount + stats.heartCount + stats.laughCount;
        
        return {
          id: img.id,
          url: img.url,
          width: img.width,
          height: img.height,
          nsfw: img.nsfw,
          nsfwLevel: img.nsfwLevel,
          stats,
          meta: img.meta,
          positiveScore,
        };
      });

      imagesWithScores.sort((a, b) => b.positiveScore - a.positiveScore);
      
      return imagesWithScores.slice(0, maxImages);
    } catch (error) {
      console.error("Error fetching images for version:", error);
      return [];
    }
  }
}
