import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import type { Model } from "@shared/schema";

interface ModelCardProps {
  model: Model;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ModelCard({ model, onView, onDelete }: ModelCardProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`model-card-${model.id}`}>
      <div className="aspect-[3/4] bg-muted overflow-hidden">
        <img
          src={model.thumbnailUrl}
          alt={model.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate mb-2" data-testid={`text-model-name-${model.id}`}>
          {model.name}
        </h3>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {model.type}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {model.baseModel}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono">
          {formatSize(model.fileSize)}
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onView?.(model.id)}
            data-testid={`button-view-${model.id}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete?.(model.id)}
            data-testid={`button-delete-${model.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
