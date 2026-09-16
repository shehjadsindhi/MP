"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  Sparkles,
  Settings,
  Activity,
  LogOut,
  Loader2,
  LogIn,
  UserPlus,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { itemCount: wishCount } = useWishlist();
  const { showToast } = useToast();

  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchOrdersCount = async () => {
        try {
          const res = await fetch("/api/orders");
          if (res.ok) {
            const data = await res.json();
            setOrderCount(data.orders?.length || 0);
          }
        } catch {
        }
      };
      fetchOrdersCount();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    showToast("Signed out of customer account", "info");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400 gap-3">
        <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin" />
        <p className="text-xs">Loading Customer Account Portal...</p>
      </div>
    );
  }

  // Guest State - Prompt user to login
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto text-galaxy-cyan shadow-galaxy-cyan">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">Customer Account Required</h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Please sign in to access your order tracking, personal AI ecosystem, saved devices, and profile settings.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/login?redirect=/account"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-galaxy-cyan text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-galaxy-cyan"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 text-gray-300 hover:text-white font-medium text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Create Account
          </Link>
        </div>
      </div>
    );
  }

  const navTabs = [
    { label: "Overview", href: "/account", icon: User },
    { label: "My Orders & Tracking", href: "/account/orders", icon: Package, badge: orderCount > 0 ? String(orderCount) : undefined },
    { label: "Profile & Addresses", href: "/account/profile", icon: Settings },
    { label: "Saved Wishlist", href: "/wishlist", icon: Heart, badge: wishCount > 0 ? String(wishCount) : undefined },
    { label: "Saved AI Tools", href: "/account/saved-ai", icon: Sparkles },
    { label: "AI Activity Logs", href: "/account/ai-usage", icon: Activity },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Customer Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-galaxy-900/90 via-slate-900 to-galaxy-950 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-galaxy-cyan to-blue-600 p-0.5 shadow-galaxy-cyan flex-shrink-0">
              <div className="w-full h-full bg-galaxy-950 rounded-[14px] flex items-center justify-center text-galaxy-cyan text-2xl font-extrabold font-mono">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-galaxy-cyan text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" /> Verified Member
                </span>
                {user.savedPersona && (
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-[10px] font-semibold">
                    {user.savedPersona}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-mono">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 hover:border-rose-500/40 border border-slate-700 text-gray-300 hover:text-rose-300 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Navigation Tabs */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 no-scrollbar" aria-label="Customer Account Navigation">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold shadow-galaxy-cyan"
                  : "bg-galaxy-900/60 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-galaxy-950" : "text-galaxy-cyan"}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-galaxy-950 text-cyan-300"
                      : "bg-slate-800 text-gray-300"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Account Child Page Content */}
      <div className="min-h-[400px]">
        {children}
      </div>
    </div>
  );
}
