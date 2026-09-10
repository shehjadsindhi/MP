"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";

interface NotificationEvent {
  type: string;
  data: {
    title?: string;
    message?: string;
    [key: string]: any;
  };
}

export default function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("EventSource" in window)) {
      return;
    }

    const eventSource = new EventSource("/api/notifications/stream");
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => setIsConnected(true);
    eventSource.onerror = () => setIsConnected(false);

    eventSource.addEventListener("notification", (event) => {
      try {
        const notification = JSON.parse(event.data) as NotificationEvent;
        setNotifications((current) => [notification, ...current].slice(0, 5));
      } catch {
        // Ignore malformed events
      }
    });

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, []);

  const dismiss = (index: number) => {
    setNotifications((current) => current.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[320px] max-w-[calc(100vw-2rem)]">
        {notifications.map((notification, index) => (
          <div
            key={`${notification.type}-${index}`}
            className="relative bg-galaxy-900 border border-cyan-500/30 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
          >
            <button
              onClick={() => dismiss(index)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 text-galaxy-cyan mb-1">
              <Bell className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {notification.type.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-xs text-gray-300">
              {notification.data.message || notification.data.title || "New notification"}
            </p>
          </div>
        ))}
      </div>

      {isConnected && (
        <div className="fixed bottom-4 left-4 z-50 hidden sm:flex items-center gap-2 text-[10px] text-emerald-400 bg-galaxy-900/90 border border-emerald-500/30 rounded-full px-3 py-1.5 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      )}
    </>
  );
}
