import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type ModelType = 'LORA' | 'Checkpoint' | 'TextualInversion' | 'Hypernetwork' | 'AestheticGradient' | 'Controlnet' | 'Poses';
export type ModelStatus = 'downloading' | 'queued' | 'completed' | 'failed';
export type BaseModel = 'SD 1.5' | 'SDXL 1.0' | 'Pony' | 'Illustrious' | 'Flux.1' | 'Other';

export interface ImageMetadata {
  id: number;
  url: string;
  width: number;
  height: number;
  nsfw: boolean;
  nsfwLevel?: number;
  stats?: {
    cryCount: number;
    laughCount: number;
    likeCount: number;
    dislikeCount: number;
    heartCount: number;
    commentCount: number;
  };
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
  positiveScore: number;
}

export interface Model {
  id: string;
  name: string;
  type: ModelType;
  baseModel: BaseModel;
  description: string;
  activationTags: string[];
  thumbnailUrl: string;
  fileSize: number;
  filePath: string;
  civitaiUrl: string;
  civitaiId: number;
  versionId: number;
  downloadedAt: string;
  galleryImages: ImageMetadata[];
}

export interface DownloadTask {
  id: string;
  modelId: number;
  versionId: number;
  name: string;
  type: ModelType;
  baseModel: BaseModel;
  thumbnailUrl: string;
  status: ModelStatus;
  progress: number;
  fileSize: number;
  downloadSpeed?: number;
  timeRemaining?: number;
  error?: string;
  addedAt: string;
}

export interface AppSettings {
  civitaiApiKey: string;
  comfyuiPath: string;
  categoryMappings: Record<string, string>;
  autoDownloadImages: boolean;
  maxGalleryImages: number;
  concurrentDownloads: number;
  downloadOnlyNsfw: boolean;
  enableAnimations: boolean;
}

export interface StorageStats {
  totalSize: number;
  modelCount: number;
  byType: Record<ModelType, { count: number; size: number }>;
  byBaseModel: Record<BaseModel, { count: number; size: number }>;
}
