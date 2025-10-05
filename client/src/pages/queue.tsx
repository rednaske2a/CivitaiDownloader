import { QueueItem } from "@/components/queue-item";
import { Button } from "@/components/ui/button";
import { Trash2, ListOrdered } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { DownloadTask } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Queue() {
  const { data: queue = [] } = useQuery<DownloadTask[]>({
    queryKey: ["/api/queue"],
  });

  const queuedTasks = queue.filter(t => t.status === 'queued');

  const handleRemove = async (id: string) => {
    try {
      await apiRequest("DELETE", `/api/queue/${id}`);
    } catch (error) {
      console.error("Failed to remove from queue:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await apiRequest("DELETE", "/api/queue");
    } catch (error) {
      console.error("Failed to clear queue:", error);
    }
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
