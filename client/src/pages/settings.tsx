import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, FolderOpen, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    civitaiApiKey: "",
    comfyuiPath: "C:/ComfyUI",
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
    toast({
      title: "Settings saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your CivitAI API key and ComfyUI installation path
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CivitAI API Configuration</CardTitle>
          <CardDescription>
            Your API key is required to download models and fetch metadata
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="Enter your CivitAI API key"
                value={settings.civitaiApiKey}
                onChange={(e) => setSettings({ ...settings, civitaiApiKey: e.target.value })}
                className="pr-10"
                data-testid="input-api-key"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowApiKey(!showApiKey)}
                data-testid="button-toggle-api-key"
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your API key from{" "}
              <a
                href="https://civitai.com/user/account"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                CivitAI Account Settings
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ComfyUI Configuration</CardTitle>
          <CardDescription>
            Set the path to your ComfyUI installation for automatic model organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comfyui-path">ComfyUI Installation Path</Label>
            <div className="flex gap-2">
              <Input
                id="comfyui-path"
                type="text"
                placeholder="C:/ComfyUI"
                value={settings.comfyuiPath}
                onChange={(e) => setSettings({ ...settings, comfyuiPath: e.target.value })}
                className="font-mono"
                data-testid="input-comfyui-path"
              />
              <Button variant="outline" data-testid="button-browse">
                <FolderOpen className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Models will be organized into subdirectories based on type and base model
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Mappings</CardTitle>
          <CardDescription>
            Configure how models are organized in your ComfyUI directory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Model Type</Label>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Folder Path</Label>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 items-center">
              <span className="text-sm">LORA (Illustrious)</span>
              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                models/loras/Illustrious
              </code>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <span className="text-sm">LORA (SDXL)</span>
              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                models/loras/SDXL
              </code>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <span className="text-sm">Checkpoint (SDXL)</span>
              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                models/checkpoints/SDXL
              </code>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <span className="text-sm">Checkpoint (SD 1.5)</span>
              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                models/checkpoints/SD15
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 sticky bottom-4 bg-background/95 backdrop-blur py-4 border-t">
        <Button variant="outline" data-testid="button-reset">
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} data-testid="button-save">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
