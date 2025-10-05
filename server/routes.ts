import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { downloadManager } from "./services/download-manager";
import { modelScanner } from "./services/model-scanner";
import { z } from "zod";

const addDownloadSchema = z.object({
  url: z.string().url(),
});

const updateSettingsSchema = z.object({
  civitaiApiKey: z.string().optional(),
  comfyuiPath: z.string().optional(),
  categoryMappings: z.record(z.string()).optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  console.log("[WebSocket] Initializing WebSocket server on path /ws");
  
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: "/ws",
    verifyClient: (info: { origin: string; secure: boolean; req: any }) => {
      console.log("[WebSocket] Connection attempt from:", info.origin);
      return true;
    }
  });

  const clients = new Set<WebSocket>();

  wss.on("listening", () => {
    console.log("[WebSocket] Server is listening");
  });

  wss.on("error", (error) => {
    console.error("[WebSocket] Server error:", error);
  });

  wss.on("connection", (ws, request) => {
    clients.add(ws);
    console.log(`[WebSocket] Client connected from ${request.socket.remoteAddress}. Total clients: ${clients.size}`);

    ws.send(JSON.stringify({ event: "connected", data: { message: "Connected to CivitAI Manager" } }));

    ws.on("close", () => {
      clients.delete(ws);
      console.log(`[WebSocket] Client disconnected. Total clients: ${clients.size}`);
    });

    ws.on("error", (error) => {
      console.error("[WebSocket] Client error:", error);
    });
  });

  const broadcast = (event: string, data: any) => {
    const message = JSON.stringify({ event, data });
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  downloadManager.on("queue-updated", async () => {
    const queue = await storage.getDownloadQueue();
    broadcast("queue-updated", queue);
  });

  downloadManager.on("task-updated", async (taskId: string) => {
    const queue = await storage.getDownloadQueue();
    const task = queue.find(t => t.id === taskId);
    if (task) {
      broadcast("task-updated", task);
    }
  });

  downloadManager.on("task-completed", async (taskId: string, model: any) => {
    broadcast("task-completed", { taskId, model });
    const models = await storage.getModels();
    broadcast("models-updated", models);
  });

  downloadManager.on("task-failed", async (taskId: string) => {
    const queue = await storage.getDownloadQueue();
    const task = queue.find(t => t.id === taskId);
    if (task) {
      broadcast("task-failed", task);
    }
  });

  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to get settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const validated = updateSettingsSchema.parse(req.body);
      
      if (validated.comfyuiPath) {
        const fs = await import("fs");
        if (!fs.existsSync(validated.comfyuiPath)) {
          res.status(400).json({ 
            error: "ComfyUI path does not exist",
            message: `The path "${validated.comfyuiPath}" could not be found. Please ensure it exists or leave it empty to simulate downloads.`
          });
          return;
        }
        
        try {
          fs.accessSync(validated.comfyuiPath, fs.constants.W_OK);
        } catch {
          res.status(400).json({ 
            error: "ComfyUI path is not writable",
            message: `The path "${validated.comfyuiPath}" exists but is not writable. Please check permissions.`
          });
          return;
        }
      }
      
      const settings = await storage.updateSettings(validated);
      
      if (validated.civitaiApiKey) {
        downloadManager.updateApiKey(validated.civitaiApiKey);
      }
      
      if (validated.comfyuiPath) {
        modelScanner.scanExistingModels().catch(err => {
          console.error("[Settings] Model scan failed:", err);
        });
      }
      
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid settings data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update settings" });
      }
    }
  });

  app.get("/api/models", async (req, res) => {
    try {
      const models = await storage.getModels();
      res.json(models);
    } catch (error) {
      res.status(500).json({ error: "Failed to get models" });
    }
  });

  app.get("/api/models/:id", async (req, res) => {
    try {
      const model = await storage.getModelById(req.params.id);
      if (!model) {
        res.status(404).json({ error: "Model not found" });
        return;
      }
      res.json(model);
    } catch (error) {
      res.status(500).json({ error: "Failed to get model" });
    }
  });

  app.delete("/api/models/:id", async (req, res) => {
    try {
      const success = await storage.deleteModel(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Model not found" });
        return;
      }
      
      const models = await storage.getModels();
      broadcast("models-updated", models);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete model" });
    }
  });

  app.get("/api/queue", async (req, res) => {
    try {
      const queue = await storage.getDownloadQueue();
      res.json(queue);
    } catch (error) {
      res.status(500).json({ error: "Failed to get queue" });
    }
  });

  app.post("/api/queue", async (req, res) => {
    try {
      const validated = addDownloadSchema.parse(req.body);
      const task = await downloadManager.addDownloadFromUrl(validated.url);
      
      if (!task) {
        res.status(400).json({ error: "Invalid CivitAI URL or model not found" });
        return;
      }
      
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to add to queue" });
      }
    }
  });

  app.delete("/api/queue/:id", async (req, res) => {
    try {
      const success = await downloadManager.cancelDownload(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel download" });
    }
  });

  app.delete("/api/queue", async (req, res) => {
    try {
      await downloadManager.clearQueue();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear queue" });
    }
  });

  app.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getStorageStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get statistics" });
    }
  });

  app.get("/api/gallery/images", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const includeNSFW = req.query.includeNSFW !== 'false';
      
      const images = await storage.getAllGalleryImages(limit, includeNSFW);
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to get gallery images" });
    }
  });

  return httpServer;
}
