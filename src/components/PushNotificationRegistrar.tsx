"use client";

import { useEffect } from "react";
import { registerPushNotifications, requestNotificationPermission } from "@/lib/pushNotifications";

export default function PushNotificationRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    const register = async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
        registerPushNotifications();
      }
    };

    register();
  }, []);

  return null;
}
