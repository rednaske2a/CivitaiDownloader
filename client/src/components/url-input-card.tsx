import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Link2 } from "lucide-react";

interface URLInputCardProps {
  onDownload?: (url: string) => void;
}

export function URLInputCard({ onDownload }: URLInputCardProps) {
  const [url, setUrl] = useState("");

  const handleDownload = () => {
    if (url.trim()) {
      console.log("Download initiated for:", url);
      onDownload?.(url);
      setUrl("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDownload();
    }
  };

  return (
    <Card className="border-card-border">
      <CardHeader>
        <CardTitle>Download Model</CardTitle>
        <CardDescription>
          Paste a CivitAI model URL to add it to the download queue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="https://civitai.com/models/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-9"
            data-testid="input-model-url"
          />
        </div>
        <Button
          onClick={handleDownload}
          disabled={!url.trim()}
          className="w-full"
          data-testid="button-download"
        >
          <Download className="h-4 w-4 mr-2" />
          Add to Queue
        </Button>
      </CardContent>
    </Card>
  );
}
