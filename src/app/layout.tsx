import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-galaxy-950 text-gray-100 min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <AIAssistant />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
