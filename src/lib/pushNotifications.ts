"use client";

import { useEffect } from "react";

export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

export function registerPushNotifications() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return;
  }

  navigator.serviceWorker.ready
    .then((registration) => registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
      ),
    }))
    .then((subscription) => {
      console.log("Push subscription:", subscription);
      return fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });
    })
    .catch((error) => {
      console.warn("Push notification registration failed:", error);
    });
}

export function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return Promise.resolve(false);
  }

  return Notification.requestPermission().then((permission) => permission === "granted");
}

export function unregisterPushNotifications() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return Promise.resolve();
  }

  return navigator.serviceWorker.ready
    .then((registration) => registration.pushManager.getSubscription())
    .then((subscription) => subscription?.unsubscribe())
    .catch(() => undefined);
}
