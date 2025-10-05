import { DownloadCard } from "../download-card";

export default function DownloadCardExample() {
  const mockTask = {
    id: "1",
    modelId: 123456,
    versionId: 789012,
    name: "Realistic Vision XL",
    type: "Checkpoint" as const,
    baseModel: "SDXL 1.0" as const,
    thumbnailUrl: "https://picsum.photos/seed/model1/400/533",
    status: "downloading" as const,
    progress: 65,
    fileSize: 6442450944,
    downloadSpeed: 5242880,
    timeRemaining: 420,
    addedAt: new Date().toISOString(),
  };

  return <DownloadCard task={mockTask} />;
}
