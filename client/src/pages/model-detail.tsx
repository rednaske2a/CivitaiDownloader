import { useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Trash2, FolderOpen, Copy, Check } from "lucide-react";
import { useLocation } from "wouter";

export default function ModelDetail() {
  const [, params] = useRoute("/model/:id");
  const [, setLocation] = useLocation();
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const mockModel = {
    id: params?.id || "1",
    name: "Realistic Vision XL",
    type: "Checkpoint",
    baseModel: "SDXL 1.0",
    description: "Realistic Vision is a photorealistic model for SDXL that produces high-quality, detailed images with excellent lighting and composition. Best used with negative prompts to avoid common artifacts.\n\nThis model works well for portraits, landscapes, and product photography. Recommended settings:\n- Steps: 25-40\n- CFG Scale: 7-9\n- Sampler: DPM++ 2M Karras",
    activationTags: ["realistic", "photo", "detailed", "professional", "high quality", "8k", "sharp focus"],
    thumbnailUrl: "https://picsum.photos/seed/model1/800/600",
    fileSize: 6442450944,
    filePath: "/models/checkpoints/SDXL/realistic-vision-xl.safetensors",
    civitaiUrl: "https://civitai.com/models/123456",
    downloadedAt: "2025-01-15T10:30:00Z",
    galleryImages: [
      "https://picsum.photos/seed/gallery1/600/800",
      "https://picsum.photos/seed/gallery2/600/800",
      "https://picsum.photos/seed/gallery3/800/600",
      "https://picsum.photos/seed/gallery4/600/800",
      "https://picsum.photos/seed/gallery5/800/600",
      "https://picsum.photos/seed/gallery6/600/800",
    ],
  };

  const formatSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/gallery")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{mockModel.name}</h1>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{mockModel.type}</Badge>
            <Badge variant="outline">{mockModel.baseModel}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-download-again">
            <Download className="h-4 w-4 mr-2" />
            Download Again
          </Button>
          <Button variant="outline" data-testid="button-open-folder">
            <FolderOpen className="h-4 w-4 mr-2" />
            Open Folder
          </Button>
          <Button variant="destructive" data-testid="button-delete-model">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <img
                src={mockModel.thumbnailUrl}
                alt={mockModel.name}
                className="w-full h-auto rounded-md"
              />
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">File Size:</span>
                <p className="font-mono">{formatSize(mockModel.fileSize)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Downloaded:</span>
                <p>{formatDate(mockModel.downloadedAt)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">File Path:</span>
                <p className="font-mono text-xs break-all">{mockModel.filePath}</p>
              </div>
              <div>
                <span className="text-muted-foreground">CivitAI URL:</span>
                <a
                  href={mockModel.civitaiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs break-all"
                  data-testid="link-civitai"
                >
                  {mockModel.civitaiUrl}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description" data-testid="tab-description">
                Description
              </TabsTrigger>
              <TabsTrigger value="tags" data-testid="tab-tags">
                Activation Tags
              </TabsTrigger>
              <TabsTrigger value="gallery" data-testid="tab-gallery">
                Gallery ({mockModel.galleryImages.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  {mockModel.description.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tags" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activation Tags</CardTitle>
                  <CardDescription>
                    Click on a tag to copy it to your clipboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockModel.activationTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover-elevate active-elevate-2"
                        onClick={() => copyTag(tag)}
                        data-testid={`tag-${tag.replace(/\s+/g, '-')}`}
                      >
                        {copiedTag === tag ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <Copy className="h-3 w-3 mr-1" />
                        )}
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockModel.galleryImages.map((img, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                      <img
                        src={img}
                        alt={`Gallery image ${i + 1}`}
                        className="w-full h-auto"
                        data-testid={`gallery-image-${i}`}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
