import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GripVertical, X } from "lucide-react";
import type { DownloadTask } from "@shared/schema";

interface QueueItemProps {
  task: DownloadTask;
  index: number;
  onRemove?: (id: string) => void;
}

export function QueueItem({ task, index, onRemove }: QueueItemProps) {
  return (
    <Card data-testid={`queue-item-${task.id}`} className="border-card-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="cursor-grab active:cursor-grabbing text-muted-foreground">
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-semibold text-primary flex-shrink-0">
            {index + 1}
          </div>
          <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0 overflow-hidden">
            {task.thumbnailUrl && (
              <img
                src={task.thumbnailUrl}
                alt={task.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <h4 className="font-semibold text-sm truncate leading-tight">{task.name}</h4>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {task.type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {task.baseModel}
              </Badge>
            </div>
          </div>
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(task.id)}
              data-testid={`button-remove-${task.id}`}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
