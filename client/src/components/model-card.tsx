import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import type { Model } from "@shared/schema";
import { useState } from "react";

interface ModelCardProps {
  model: Model;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ModelCard({ model, onView, onDelete }: ModelCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <Card 
      className="overflow-hidden hover-elevate cursor-pointer border-card-border transition-transform duration-200 hover:scale-[1.02]" 
      data-testid={`model-card-${model.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView?.(model.id)}
    >
      <div className="aspect-[3/4] bg-muted overflow-hidden relative">
        <img
          src={model.thumbnailUrl}
          alt={model.name}
          className="w-full h-full object-cover"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity duration-200">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView?.(model.id);
              }}
              data-testid={`button-view-${model.id}`}
              className="bg-background/90 backdrop-blur"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(model.id);
              }}
              data-testid={`button-delete-${model.id}`}
              className="bg-destructive/90 backdrop-blur"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold truncate leading-tight" data-testid={`text-model-name-${model.id}`}>
          {model.name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 flex-wrap min-w-0">
            <Badge variant="secondary" className="text-xs">
              {model.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {model.baseModel}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground font-mono flex-shrink-0">
            {formatSize(model.fileSize)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
