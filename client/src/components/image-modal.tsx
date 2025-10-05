import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Download, Heart, ThumbsUp, Laugh, Frown, MessageCircle, Copy, Check } from "lucide-react";
import type { ImageMetadata } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

interface ImageModalProps {
  image: ImageMetadata | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ image, isOpen, onClose }: ImageModalProps) {
  const { toast } = useToast();
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);

  if (!image) return null;

  const copyToClipboard = (text: string, type: 'prompt' | 'negative') => {
    navigator.clipboard.writeText(text);
    if (type === 'prompt') {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedNegative(true);
      setTimeout(() => setCopiedNegative(false), 2000);
    }
  };

  const handleAddToQueue = async (resourceId: number, resourceName: string) => {
    try {
      await apiRequest("POST", "/api/queue", { 
        url: `https://civitai.com/models/${resourceId}` 
      });
      toast({
        title: "Added to queue",
        description: `${resourceName} has been added to the download queue.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to queue.",
        variant: "destructive",
      });
    }
  };

  const stats = image.stats || {
    heartCount: 0,
    likeCount: 0,
    laughCount: 0,
    dislikeCount: 0,
    cryCount: 0,
    commentCount: 0,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 gap-0 bg-background dark:bg-card">
        <div className="grid md:grid-cols-2 h-full">
          <div className="bg-black dark:bg-black flex items-center justify-center p-6 md:p-8">
            <motion.img
              src={image.url}
              alt="Gallery image"
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              data-testid="image-modal-image"
            />
          </div>

          <ScrollArea className="h-[90vh] md:h-auto">
            <div className="p-6 space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl">Image Details</DialogTitle>
                <DialogDescription>
                  Generated image metadata and generation parameters
                </DialogDescription>
              </DialogHeader>

              {image.stats && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">Community Reactions</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.heartCount > 0 && (
                      <Badge variant="secondary" className="gap-1.5 py-1.5" data-testid="stat-hearts">
                        <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                        {stats.heartCount.toLocaleString()}
                      </Badge>
                    )}
                    {stats.likeCount > 0 && (
                      <Badge variant="secondary" className="gap-1.5 py-1.5" data-testid="stat-likes">
                        <ThumbsUp className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
                        {stats.likeCount.toLocaleString()}
                      </Badge>
                    )}
                    {stats.laughCount > 0 && (
                      <Badge variant="secondary" className="gap-1.5 py-1.5" data-testid="stat-laughs">
                        <Laugh className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
                        {stats.laughCount.toLocaleString()}
                      </Badge>
                    )}
                    {stats.commentCount > 0 && (
                      <Badge variant="secondary" className="gap-1.5 py-1.5" data-testid="stat-comments">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {stats.commentCount.toLocaleString()}
                      </Badge>
                    )}
                    <Badge variant="outline" className="gap-1.5 py-1.5 font-semibold" data-testid="stat-score">
                      Score: {image.positiveScore.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              )}

              <Separator />

              {image.meta?.prompt && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground">Prompt</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(image.meta!.prompt!, 'prompt')}
                      data-testid="button-copy-prompt"
                    >
                      {copiedPrompt ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm leading-relaxed bg-muted/50 dark:bg-muted/30 p-3 rounded-md" data-testid="text-prompt">
                    {image.meta.prompt}
                  </p>
                </div>
              )}

              {image.meta?.negativePrompt && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground">Negative Prompt</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(image.meta!.negativePrompt!, 'negative')}
                      data-testid="button-copy-negative"
                    >
                      {copiedNegative ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm leading-relaxed bg-muted/50 dark:bg-muted/30 p-3 rounded-md text-muted-foreground" data-testid="text-negative-prompt">
                    {image.meta.negativePrompt}
                  </p>
                </div>
              )}

              {image.meta && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">Generation Parameters</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {image.meta.seed !== undefined && (
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Seed</span>
                        <p className="font-mono text-sm" data-testid="text-seed">{image.meta.seed}</p>
                      </div>
                    )}
                    {image.meta.steps && (
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Steps</span>
                        <p className="font-mono text-sm" data-testid="text-steps">{image.meta.steps}</p>
                      </div>
                    )}
                    {image.meta.sampler && (
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Sampler</span>
                        <p className="text-sm" data-testid="text-sampler">{image.meta.sampler}</p>
                      </div>
                    )}
                    {image.meta.cfgScale && (
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">CFG Scale</span>
                        <p className="font-mono text-sm" data-testid="text-cfg">{image.meta.cfgScale}</p>
                      </div>
                    )}
                    {image.meta.clipSkip && (
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Clip Skip</span>
                        <p className="font-mono text-sm" data-testid="text-clip-skip">{image.meta.clipSkip}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {image.meta?.resources && image.meta.resources.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Resources Used ({image.meta.resources.length})
                    </h3>
                    <div className="space-y-2">
                      {image.meta.resources.map((resource, idx) => (
                        <motion.div
                          key={`${resource.id}-${idx}`}
                          className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50 dark:bg-muted/30 hover:bg-muted dark:hover:bg-muted/50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          data-testid={`resource-${idx}`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" data-testid={`resource-name-${idx}`}>
                              {resource.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs" data-testid={`resource-type-${idx}`}>
                                {resource.type}
                              </Badge>
                              {resource.weight !== undefined && (
                                <span className="text-xs text-muted-foreground" data-testid={`resource-weight-${idx}`}>
                                  Weight: {resource.weight}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddToQueue(resource.id, resource.name)}
                            className="shrink-0"
                            data-testid={`button-queue-resource-${idx}`}
                          >
                            <Download className="h-4 w-4 mr-1.5" />
                            Queue
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Image ID: {image.id}</span>
                <span>{image.width} × {image.height}</span>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
