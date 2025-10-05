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
import { useQuery } from "@tanstack/react-query";
import type { StorageStats } from "@shared/schema";

export default function Statistics() {
  const { data: stats } = useQuery<StorageStats>({
    queryKey: ["/api/statistics"],
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const storageByType = stats ? Object.entries(stats.byType)
    .filter(([_, data]) => data.count > 0)
    .map(([name, data]) => ({
      name,
      value: data.count,
      size: data.size,
    })) : [];

  const storageByBaseModel = stats ? Object.entries(stats.byBaseModel)
    .filter(([_, data]) => data.count > 0)
    .map(([name, data]) => ({
      name,
      value: data.count,
      size: data.size,
    })) : [];

  const totalSize = stats?.totalSize || 0;
  const totalModels = stats?.modelCount || 0;

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
            <p className="text-4xl font-bold tracking-tight">
              {totalModels > 0 ? formatSize(totalSize / totalModels) : "0 GB"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Per model
            </p>
          </CardContent>
        </Card>
      </div>

      {storageByType.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StorageChart
            data={storageByType}
            title="Storage by Model Type"
            description="Distribution of disk space by model category"
          />
          {storageByBaseModel.length > 0 && (
            <StorageChart
              data={storageByBaseModel}
              title="Storage by Base Model"
              description="Distribution of disk space by base model version"
            />
          )}
        </div>
      )}

      {storageByType.length > 0 && (
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
                      {totalSize > 0 ? ((item.size / totalSize) * 100).toFixed(1) : 0}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {totalModels === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No models downloaded yet</p>
        </div>
      )}
    </div>
  );
}
