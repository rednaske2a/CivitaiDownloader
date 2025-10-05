import { useState } from "react";
import { ModelCard } from "@/components/model-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLocation } from "wouter";
import type { Model } from "@shared/schema";

export default function Gallery() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const mockModels: Model[] = [
    {
      id: "1",
      name: "Realistic Vision XL",
      type: "Checkpoint",
      baseModel: "SDXL 1.0",
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
    },
    {
      id: "2",
      name: "Detail Tweaker LoRA",
      type: "LORA",
      baseModel: "Illustrious",
      description: "Enhances fine details in illustrations",
      activationTags: ["detail", "sharp", "quality"],
      thumbnailUrl: "https://picsum.photos/seed/model2/400/533",
      fileSize: 209715200,
      filePath: "/models/loras/Illustrious/detail-tweaker.safetensors",
      civitaiUrl: "https://civitai.com/models/234567",
      civitaiId: 234567,
      versionId: 890123,
      downloadedAt: "2025-01-14T15:20:00Z",
      galleryImages: [],
    },
    {
      id: "3",
      name: "Anime Style Mix",
      type: "Checkpoint",
      baseModel: "SD 1.5",
      description: "High quality anime artwork generator",
      activationTags: ["anime", "illustration", "colorful"],
      thumbnailUrl: "https://picsum.photos/seed/model3/400/533",
      fileSize: 4294967296,
      filePath: "/models/checkpoints/SD15/anime-style-mix.safetensors",
      civitaiUrl: "https://civitai.com/models/345678",
      civitaiId: 345678,
      versionId: 901234,
      downloadedAt: "2025-01-13T08:45:00Z",
      galleryImages: [],
    },
    {
      id: "4",
      name: "Pony Realism",
      type: "LORA",
      baseModel: "Pony",
      description: "Adds realistic elements to pony diffusion",
      activationTags: ["realistic", "detailed"],
      thumbnailUrl: "https://picsum.photos/seed/model4/400/533",
      fileSize: 157286400,
      filePath: "/models/loras/Pony/pony-realism.safetensors",
      civitaiUrl: "https://civitai.com/models/456789",
      civitaiId: 456789,
      versionId: 123450,
      downloadedAt: "2025-01-12T12:00:00Z",
      galleryImages: [],
    },
    {
      id: "5",
      name: "Flux Pro Ultra",
      type: "Checkpoint",
      baseModel: "Flux.1",
      description: "Professional grade Flux model",
      activationTags: ["professional", "high-quality"],
      thumbnailUrl: "https://picsum.photos/seed/model5/400/533",
      fileSize: 8589934592,
      filePath: "/models/checkpoints/Flux/flux-pro-ultra.safetensors",
      civitaiUrl: "https://civitai.com/models/567890",
      civitaiId: 567890,
      versionId: 234561,
      downloadedAt: "2025-01-11T18:30:00Z",
      galleryImages: [],
    },
    {
      id: "6",
      name: "Style Enhancer",
      type: "LORA",
      baseModel: "SDXL 1.0",
      description: "Enhances artistic style in generations",
      activationTags: ["style", "artistic", "enhanced"],
      thumbnailUrl: "https://picsum.photos/seed/model6/400/533",
      fileSize: 178257920,
      filePath: "/models/loras/SDXL/style-enhancer.safetensors",
      civitaiUrl: "https://civitai.com/models/678901",
      civitaiId: 678901,
      versionId: 345672,
      downloadedAt: "2025-01-10T09:15:00Z",
      galleryImages: [],
    },
  ];

  const filteredModels = mockModels.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.baseModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewModel = (id: string) => {
    setLocation(`/model/${id}`);
  };

  const handleDeleteModel = (id: string) => {
    console.log("Delete model:", id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Model Gallery</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage your downloaded models
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-models"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredModels.map(model => (
          <ModelCard
            key={model.id}
            model={model}
            onView={handleViewModel}
            onDelete={handleDeleteModel}
          />
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No models found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
