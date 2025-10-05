import { useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Trash2, FolderOpen, Copy, Check, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import type { Model, ImageMetadata } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ImageModal } from "@/components/image-modal";
import { motion } from "framer-motion";

export default function ModelDetail() {
  const [, params] = useRoute("/model/:id");
  const [, setLocation] = useLocation();
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const { toast } = useToast();

  const { data: model } = useQuery<Model>({
    queryKey: ["/api/models", params?.id],
    enabled: !!params?.id,
  });

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

  const handleDownloadAgain = async () => {
    if (!model) return;
    try {
      await apiRequest("POST", "/api/queue", { url: model.civitaiUrl });
      toast({
        title: "Added to queue",
        description: "The model has been added to the download queue.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add model to queue.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!model) return;
    try {
      await apiRequest("DELETE", `/api/models/${model.id}`);
      toast({
        title: "Model deleted",
        description: "The model has been removed from your collection.",
      });
      setLocation("/gallery");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete model.",
        variant: "destructive",
      });
    }
  };

  if (!model) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading model...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button 
          onClick={() => setLocation("/gallery")}
          className="hover:text-foreground transition-colors"
        >
          Gallery
        </button>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{model.name}</span>
      </div>

      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/gallery")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{model.name}</h1>
          </div>
          <div className="flex gap-2 ml-12">
            <Badge variant="secondary">{model.type}</Badge>
            <Badge variant="outline">{model.baseModel}</Badge>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleDownloadAgain} data-testid="button-download-again">
            <Download className="h-4 w-4 mr-2" />
            Download Again
          </Button>
          <Button variant="outline" data-testid="button-open-folder">
            <FolderOpen className="h-4 w-4 mr-2" />
            Open Folder
          </Button>
          <Button variant="destructive" onClick={handleDelete} data-testid="button-delete-model">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-card-border">
            <CardContent className="p-0">
              <img
                src={model.thumbnailUrl}
                alt={model.name}
                className="w-full h-auto"
              />
            </CardContent>
          </Card>

          <Card className="border-card-border">
            <CardHeader>
              <CardTitle className="text-base">Model Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">File Size</span>
                <p className="font-mono">{formatSize(model.fileSize)}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Downloaded</span>
                <p className="text-sm">{formatDate(model.downloadedAt)}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">File Path</span>
                <p className="font-mono text-xs break-all text-muted-foreground">{model.filePath}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">CivitAI URL</span>
                <a
                  href={model.civitaiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs break-all block"
                  data-testid="link-civitai"
                >
                  {model.civitaiUrl}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="description">
            <TabsList className="mb-6">
              <TabsTrigger value="description" data-testid="tab-description">
                Description
              </TabsTrigger>
              <TabsTrigger value="tags" data-testid="tab-tags">
                Activation Tags
              </TabsTrigger>
              <TabsTrigger value="gallery" data-testid="tab-gallery">
                Gallery ({model.galleryImages.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                  <CardDescription>Model details and usage recommendations</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  {model.description.split("\n").map((paragraph, i) => (
                    <p key={i} className="text-sm leading-relaxed">{paragraph}</p>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tags">
              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle>Activation Tags</CardTitle>
                  <CardDescription>
                    Click on a tag to copy it to your clipboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {model.activationTags.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No activation tags available</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {model.activationTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer hover-elevate active-elevate-2 text-sm py-2 px-3"
                          onClick={() => copyTag(tag)}
                          data-testid={`tag-${tag.replace(/\s+/g, '-')}`}
                        >
                          {copiedTag === tag ? (
                            <Check className="h-3 w-3 mr-2" />
                          ) : (
                            <Copy className="h-3 w-3 mr-2" />
                          )}
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery">
              {model.galleryImages.length === 0 ? (
                <Card className="border-card-border">
                  <CardContent className="py-16 text-center">
                    <p className="text-sm text-muted-foreground">No gallery images available</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {model.galleryImages.map((img, i) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card 
                          className="overflow-hidden border-card-border hover-elevate cursor-pointer group"
                          onClick={() => setSelectedImage(img)}
                          data-testid={`gallery-image-${i}`}
                        >
                          <CardContent className="p-0 relative">
                            <img
                              src={img.url}
                              alt={`Gallery image ${i + 1}`}
                              className="w-full h-auto transition-transform group-hover:scale-105"
                            />
                            {img.positiveScore > 0 && (
                              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-semibold">
                                ❤️ {img.positiveScore}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  <ImageModal
                    image={selectedImage}
                    isOpen={!!selectedImage}
                    onClose={() => setSelectedImage(null)}
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
