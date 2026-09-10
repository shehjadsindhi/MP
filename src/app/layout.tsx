import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { FeatureFlagsProvider } from "@/context/FeatureFlagsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import { registerServiceWorker } from "@/lib/serviceWorker";
import AccessibilityImprovements from "@/components/AccessibilityImprovements";
import Analytics from "@/components/Analytics";
import PushNotificationRegistrar from "@/components/PushNotificationRegistrar";
import RealtimeNotifications from "@/components/RealtimeNotifications";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "Galaxy AI Hub — Intelligence That Works For You",
  description:
    "Discover Galaxy AI. Explore intelligent tools for productivity, creativity, communication and everyday life across Galaxy smartphones, tablets, and wearables.",
  keywords: [
    "Galaxy AI",
    "Circle to Search",
    "Live Translate",
    "Generative Edit",
    "Note Assist",
    "Galaxy S25 Ultra",
    "Galaxy Z Fold 6",
    "Knox Vault",
  ],
  openGraph: {
    title: "Galaxy AI Hub — Next-Gen Intelligence",
    description: "Experience on-device Galaxy AI tools and explore flagship devices.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Galaxy AI Hub — Next-Gen Intelligence",
    description: "Experience on-device Galaxy AI tools and explore flagship devices.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Galaxy AI Hub",
    description: "AI-powered e-commerce platform for Galaxy devices",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00f0ff" />
      </head>
      <body className="bg-galaxy-950 text-gray-100 min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
        <ToastProvider>
          <ThemeProvider>
            <AuthProvider>
              <FeatureFlagsProvider>
                <CartProvider>
                  <WishlistProvider>
                    <Navbar />
                    <main id="main-content" className="flex-1">{children}</main>
                    <Footer />
                    <AIAssistant />
                  </WishlistProvider>
                </CartProvider>
              </FeatureFlagsProvider>
            </AuthProvider>
          </ThemeProvider>
        </ToastProvider>
        <ServiceWorkerRegistrar />
        <AccessibilityImprovements />
        <Analytics />
        <PushNotificationRegistrar />
        <RealtimeNotifications />
        <MobileBottomNav />
      </body>
    </html>
  );
}

function ServiceWorkerRegistrar() {
  if (typeof window !== "undefined") {
    registerServiceWorker();
  }
  return null;
}
