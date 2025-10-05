import { StorageChart } from "@/components/storage-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Statistics() {
  const storageByType = [
    { name: "Checkpoint", value: 15, size: 64424509440 },
    { name: "LORA", value: 28, size: 5872025600 },
    { name: "TextualInversion", value: 4, size: 41943040 },
  ];

  const storageByBaseModel = [
    { name: "SDXL 1.0", value: 18, size: 32212254720 },
    { name: "SD 1.5", value: 12, size: 25769803776 },
    { name: "Illustrious", value: 10, size: 8589934592 },
    { name: "Pony", value: 5, size: 2147483648 },
    { name: "Flux.1", value: 2, size: 4294967296 },
  ];

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const totalSize = storageByType.reduce((acc, item) => acc + item.size, 0);
  const totalModels = storageByType.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Storage Statistics</h1>
        <p className="text-sm text-muted-foreground">
          Analyze your model collection and disk usage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-card-border">
          <CardHeader>
            <CardTitle className="text-base">Total Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tracking-tight">{formatSize(totalSize)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Across {totalModels} models
            </p>
          </CardContent>
        </Card>
        <Card className="border-card-border">
          <CardHeader>
            <CardTitle className="text-base">Average Model Size</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tracking-tight">{formatSize(totalSize / totalModels)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Per model
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StorageChart
          data={storageByType}
          title="Storage by Model Type"
          description="Distribution of disk space by model category"
        />
        <StorageChart
          data={storageByBaseModel}
          title="Storage by Base Model"
          description="Distribution of disk space by base model version"
        />
      </div>

      <Card className="border-card-border">
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
          <CardDescription>
            Complete storage analysis by model type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Type</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="text-right">Total Size</TableHead>
                <TableHead className="text-right">Avg Size</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storageByType.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{item.value}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatSize(item.size)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatSize(item.size / item.value)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {((item.size / totalSize) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
