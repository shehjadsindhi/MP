const isDevelopment = process.env.NODE_ENV === "development";

export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || isDevelopment) {
    return;
  }

  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("SW registered: ", registration);
    })
    .catch((registrationError) => {
      console.log("SW registration failed: ", registrationError);
    });
}
