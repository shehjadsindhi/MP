"use client";

import { useEffect, useRef, useState } from "react";

export interface NotificationEvent {
  type: string;
  data: any;
  timestamp: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const connect = () => {
      try {
        const eventSource = new EventSource("/api/notifications/stream");
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            setNotifications((prev) => [...prev, parsed]);
          } catch (e) {
            console.warn("Failed to parse notification:", e);
          }
        };

        eventSource.onerror = () => {
          setConnected(false);
          eventSource.close();
          setTimeout(connect, 3000);
        };
      } catch (e) {
        console.warn("Failed to connect to notifications:", e);
        setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return { notifications, connected, clearNotifications };
}
