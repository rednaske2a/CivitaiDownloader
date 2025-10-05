import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DownloadTask } from "@shared/schema";

interface DownloadCardProps {
  task: DownloadTask;
  onCancel?: (id: string) => void;
}

export function DownloadCard({ task, onCancel }: DownloadCardProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatSpeed = (bytesPerSec?: number) => {
    if (!bytesPerSec) return "Calculating...";
    return `${formatSize(bytesPerSec)}/s`;
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return "Calculating...";
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  return (
    <Card data-testid={`download-card-${task.id}`} className="border-card-border">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0 overflow-hidden">
            {task.thumbnailUrl && (
              <img
                src={task.thumbnailUrl}
                alt={task.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0 space-y-2">
                <h4 className="font-semibold text-sm truncate leading-tight" data-testid={`text-name-${task.id}`}>
                  {task.name}
                </h4>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {task.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {task.baseModel}
                  </Badge>
                </div>
              </div>
              {onCancel && task.status !== 'completed' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => onCancel(task.id)}
                  data-testid={`button-cancel-${task.id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Progress value={task.progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-mono">
                  {task.progress}% • {formatSize(task.fileSize)}
                </span>
                {task.status === 'downloading' && (
                  <span className="font-mono">
                    {formatSpeed(task.downloadSpeed)} • {formatTime(task.timeRemaining)}
                  </span>
                )}
                {task.status === 'queued' && <span>Queued</span>}
                {task.status === 'failed' && (
                  <span className="text-destructive">{task.error || 'Failed'}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
