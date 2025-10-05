import { URLInputCard } from "@/components/url-input-card";
import { DownloadCard } from "@/components/download-card";
import { StatsCard } from "@/components/stats-card";
import { Database, Download, FolderOpen, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { DownloadTask, StorageStats } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Dashboard() {
  const { data: queue = [] } = useQuery<DownloadTask[]>({
    queryKey: ["/api/queue"],
  });

  const { data: stats } = useQuery<StorageStats>({
    queryKey: ["/api/statistics"],
  });

  const activeDownloads = queue.filter(t => t.status === 'downloading' || t.status === 'queued');

  const handleDownload = async (url: string) => {
    try {
      await apiRequest("POST", "/api/queue", { url });
    } catch (error) {
      console.error("Failed to add download:", error);
    }
  };

  const handleCancelDownload = async (id: string) => {
    try {
      await apiRequest("DELETE", `/api/queue/${id}`);
    } catch (error) {
      console.error("Failed to cancel download:", error);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Download and manage your CivitAI models
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Models"
          value={stats?.modelCount || 0}
          icon={Database}
          description="Across all categories"
        />
        <StatsCard
          title="Total Storage"
          value={stats ? formatSize(stats.totalSize) : "0 GB"}
          icon={FolderOpen}
          description="On disk"
        />
        <StatsCard
          title="Active Downloads"
          value={queue.filter(d => d.status === 'downloading').length}
          icon={Download}
        />
        <StatsCard
          title="Queue Length"
          value={queue.filter(d => d.status === 'queued').length}
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <URLInputCard onDownload={handleDownload} />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Active Downloads</h2>
          {activeDownloads.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Download className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-sm">No active downloads</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeDownloads.map(task => (
                <DownloadCard
                  key={task.id}
                  task={task}
                  onCancel={handleCancelDownload}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
