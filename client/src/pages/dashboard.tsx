import { useState } from "react";
import { URLInputCard } from "@/components/url-input-card";
import { DownloadCard } from "@/components/download-card";
import { StatsCard } from "@/components/stats-card";
import { Database, Download, FolderOpen, Clock } from "lucide-react";
import type { DownloadTask } from "@shared/schema";

export default function Dashboard() {
  const [activeDownloads, setActiveDownloads] = useState<DownloadTask[]>([
    {
      id: "1",
      modelId: 123456,
      versionId: 789012,
      name: "Realistic Vision XL",
      type: "Checkpoint",
      baseModel: "SDXL 1.0",
      thumbnailUrl: "https://picsum.photos/seed/model1/400/533",
      status: "downloading",
      progress: 65,
      fileSize: 6442450944,
      downloadSpeed: 5242880,
      timeRemaining: 420,
      addedAt: new Date().toISOString(),
    },
    {
      id: "2",
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
  ]);

  const handleDownload = (url: string) => {
    console.log("Adding to queue:", url);
  };

  const handleCancelDownload = (id: string) => {
    console.log("Cancelling download:", id);
    setActiveDownloads(activeDownloads.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Download and manage your CivitAI models
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Models"
          value="47"
          icon={Database}
          description="Across all categories"
        />
        <StatsCard
          title="Total Storage"
          value="124 GB"
          icon={FolderOpen}
          description="On disk"
        />
        <StatsCard
          title="Active Downloads"
          value={activeDownloads.filter(d => d.status === 'downloading').length}
          icon={Download}
        />
        <StatsCard
          title="Queue Length"
          value={activeDownloads.filter(d => d.status === 'queued').length}
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <URLInputCard onDownload={handleDownload} />

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Downloads</h2>
            {activeDownloads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No active downloads
              </div>
            ) : (
              <div className="space-y-3">
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
    </div>
  );
}
