"use client";

import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { FeatureFlagsProvider } from "@/context/FeatureFlagsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import AccessibilityImprovements from "@/components/AccessibilityImprovements";
import PushNotificationRegistrar from "@/components/PushNotificationRegistrar";
import RealtimeNotifications from "@/components/RealtimeNotifications";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
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
      </ToastProvider>
      <AccessibilityImprovements />
      <PushNotificationRegistrar />
      <RealtimeNotifications />
      <MobileBottomNav />
    </ThemeProvider>
  );
}
