import { ModelCard } from "../model-card";

export default function ModelCardExample() {
  const mockModel = {
    id: "1",
    name: "Realistic Vision XL",
    type: "Checkpoint" as const,
    baseModel: "SDXL 1.0" as const,
    description: "A photorealistic model for SDXL",
    activationTags: ["realistic", "photo", "detailed"],
    thumbnailUrl: "https://picsum.photos/seed/model1/400/533",
    fileSize: 6442450944,
    filePath: "/models/checkpoints/SDXL/realistic-vision-xl.safetensors",
    civitaiUrl: "https://civitai.com/models/123456",
    civitaiId: 123456,
    versionId: 789012,
    downloadedAt: "2025-01-15T10:30:00Z",
    galleryImages: [],
  };

  return <ModelCard model={mockModel} />;
}
