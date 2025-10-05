import { StorageChart } from "../storage-chart";

export default function StorageChartExample() {
  const mockData = [
    { name: "Checkpoint", value: 15, size: 64424509440 },
    { name: "LORA", value: 28, size: 5872025600 },
    { name: "TextualInversion", value: 4, size: 41943040 },
  ];

  return <StorageChart data={mockData} title="Storage by Model Type" />;
}
