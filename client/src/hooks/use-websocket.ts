import { useEffect, useRef } from "react";
import { queryClient } from "@/lib/queryClient";

type WebSocketMessage = {
  event: string;
  data: any;
};

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const startPolling = () => {
    if (pollingInterval.current) return;
    
    console.log("Starting polling fallback for real-time updates");
    pollingInterval.current = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
      queryClient.invalidateQueries({ queryKey: ["/api/models"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
    }, 2000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const connect = () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.log("Max WebSocket reconnection attempts reached, using polling");
      startPolling();
      return;
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected successfully");
        reconnectAttempts.current = 0;
        stopPolling();
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.event) {
            case "queue-updated":
            case "task-updated":
            case "task-failed":
              queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
              break;
            case "task-completed":
            case "models-updated":
              queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
              queryClient.invalidateQueries({ queryKey: ["/api/models"] });
              queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
              break;
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.current.onerror = (error) => {
        console.warn("WebSocket error, will retry or fallback to polling");
      };

      ws.current.onclose = () => {
        ws.current = null;
        reconnectAttempts.current++;
        
        if (reconnectAttempts.current < maxReconnectAttempts) {
          console.log(`WebSocket disconnected, attempting reconnect ${reconnectAttempts.current}/${maxReconnectAttempts}`);
          setTimeout(connect, 3000);
        } else {
          startPolling();
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      reconnectAttempts.current++;
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        startPolling();
      }
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      stopPolling();
    };
  }, []);
}
