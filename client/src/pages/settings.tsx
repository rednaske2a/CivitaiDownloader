import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Eye, EyeOff, FolderOpen, Save, Download, Image as ImageIcon, Zap, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { AppSettings } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Settings() {
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    civitaiApiKey: "",
    comfyuiPath: "",
    categoryMappings: {},
    autoDownloadImages: true,
    maxGalleryImages: 100,
    concurrentDownloads: 3,
    downloadOnlyNsfw: false,
    enableAnimations: true,
  });

  const { data: savedSettings } = useQuery<AppSettings>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, [savedSettings]);

  const handleSave = async () => {
    try {
      await apiRequest("POST", "/api/settings", settings);
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings saved",
        description: "Your configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure your CivitAI API key and ComfyUI installation path
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-card-border">
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

        <Card className="border-card-border">
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
                  placeholder="C:/ComfyUI or /home/user/ComfyUI"
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

        <Card className="border-card-border">
          <CardHeader>
            <CardTitle>Download Preferences</CardTitle>
            <CardDescription>
              Customize how models and images are downloaded
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="auto-download" className="font-medium">Auto-download images</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically fetch top 100 images when downloading a model
                </p>
              </div>
              <Switch
                id="auto-download"
                checked={settings.autoDownloadImages}
                onCheckedChange={(checked) => setSettings({ ...settings, autoDownloadImages: checked })}
                data-testid="switch-auto-download"
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="max-images" className="font-medium">Maximum gallery images</Label>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="max-images"
                  min={10}
                  max={200}
                  step={10}
                  value={[settings.maxGalleryImages]}
                  onValueChange={(value) => setSettings({ ...settings, maxGalleryImages: value[0] })}
                  className="flex-1"
                  data-testid="slider-max-images"
                />
                <Input
                  type="number"
                  min={10}
                  max={200}
                  value={settings.maxGalleryImages}
                  onChange={(e) => setSettings({ ...settings, maxGalleryImages: parseInt(e.target.value) || 100 })}
                  className="w-20"
                  data-testid="input-max-images"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Number of top-rated images to fetch per model (ranked by community reactions)
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="concurrent-downloads" className="font-medium">Concurrent downloads</Label>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="concurrent-downloads"
                  min={1}
                  max={5}
                  step={1}
                  value={[settings.concurrentDownloads]}
                  onValueChange={(value) => setSettings({ ...settings, concurrentDownloads: value[0] })}
                  className="flex-1"
                  data-testid="slider-concurrent-downloads"
                />
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={settings.concurrentDownloads}
                  onChange={(e) => setSettings({ ...settings, concurrentDownloads: parseInt(e.target.value) || 3 })}
                  className="w-20"
                  data-testid="input-concurrent-downloads"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Maximum number of simultaneous downloads (1-5)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-card-border">
          <CardHeader>
            <CardTitle>UI Preferences</CardTitle>
            <CardDescription>
              Customize the look and feel of the interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="animations" className="font-medium">Enable animations</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Smooth transitions and micro-interactions throughout the app
                </p>
              </div>
              <Switch
                id="animations"
                checked={settings.enableAnimations}
                onCheckedChange={(checked) => setSettings({ ...settings, enableAnimations: checked })}
                data-testid="switch-animations"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-card-border">
          <CardHeader>
            <CardTitle>Category Mappings</CardTitle>
            <CardDescription>
              Configure how models are organized in your ComfyUI directory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-3">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Model Type</Label>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Folder Path</Label>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                {Object.entries(settings.categoryMappings).slice(0, 8).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-4 items-center">
                    <span className="text-sm">{key.replace(/_/g, " ")}</span>
                    <code className="text-xs font-mono bg-muted px-3 py-2 rounded-md">
                      {value}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" data-testid="button-reset" onClick={() => savedSettings && setSettings(savedSettings)}>
          Reset to Saved
        </Button>
        <Button onClick={handleSave} data-testid="button-save">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
