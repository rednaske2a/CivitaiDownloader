import { useState } from "react";
import { QueueItem } from "@/components/queue-item";
import { Button } from "@/components/ui/button";
import { Trash2, ListOrdered } from "lucide-react";
import type { DownloadTask } from "@shared/schema";

export default function Queue() {
  const [queuedTasks, setQueuedTasks] = useState<DownloadTask[]>([
    {
      id: "1",
      modelId: 234567,
      versionId: 890123,
      name: "Detail Tweaker LoRA",
      type: "LORA",
      baseModel: "Illustrious",
      thumbnailUrl: "https://picsum.photos/seed/model2/400/533",
      status: "queued",
      progress: 0,
      fileSize: 209715200,
      addedAt: new Date().toISOString(),
    },
    {
      id: "2",
      modelId: 345678,
      versionId: 901234,
      name: "Anime Style Mix",
      type: "Checkpoint",
      baseModel: "SD 1.5",
      thumbnailUrl: "https://picsum.photos/seed/model3/400/533",
      status: "queued",
      progress: 0,
      fileSize: 4294967296,
      addedAt: new Date().toISOString(),
    },
    {
      id: "3",
      modelId: 456789,
      versionId: 123450,
      name: "Pony Realism",
      type: "LORA",
      baseModel: "Pony",
      thumbnailUrl: "https://picsum.photos/seed/model4/400/533",
      status: "queued",
      progress: 0,
      fileSize: 157286400,
      addedAt: new Date().toISOString(),
    },
  ]);

  const handleRemove = (id: string) => {
    console.log("Removing from queue:", id);
    setQueuedTasks(queuedTasks.filter(t => t.id !== id));
  };

  const handleClearAll = () => {
    console.log("Clearing all queued tasks");
    setQueuedTasks([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Download Queue</h1>
          <p className="text-sm text-muted-foreground">
            Manage your pending downloads
          </p>
        </div>
        {queuedTasks.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleClearAll}
            data-testid="button-clear-queue"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Queue
          </Button>
        )}
      </div>

      {queuedTasks.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
            <ListOrdered className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No queued downloads</h3>
          <p className="text-sm text-muted-foreground">
            Add models from the dashboard to start downloading
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {queuedTasks.map((task, index) => (
            <QueueItem
              key={task.id}
              task={task}
              index={index}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
