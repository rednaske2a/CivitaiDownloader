import { QueueItem } from "../queue-item";

export default function QueueItemExample() {
  const mockTask = {
    id: "1",
    modelId: 234567,
    versionId: 890123,
    name: "Detail Tweaker LoRA",
    type: "LORA" as const,
    baseModel: "Illustrious" as const,
    thumbnailUrl: "https://picsum.photos/seed/model2/400/533",
    status: "queued" as const,
    progress: 0,
    fileSize: 209715200,
    addedAt: new Date().toISOString(),
  };

  return <QueueItem task={mockTask} index={0} />;
}
