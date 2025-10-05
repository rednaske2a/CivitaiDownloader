import { useEffect, useRef, useCallback } from "react";
import { queryClient } from "@/lib/queryClient";

type WebSocketMessage = {
  event: string;
  data: any;
};

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        switch (message.event) {
          case "queue-updated":
            queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
            break;
          case "task-updated":
            queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
            break;
          case "task-completed":
            queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
            queryClient.invalidateQueries({ queryKey: ["/api/models"] });
            queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
            break;
          case "task-failed":
            queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
            break;
          case "models-updated":
            queryClient.invalidateQueries({ queryKey: ["/api/models"] });
            queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
            break;
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected, reconnecting...");
      setTimeout(connect, 3000);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);
}
