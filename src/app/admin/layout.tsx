"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Smartphone,
  Package,
  Users,
  Sparkles,
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "ADMIN") {
        router.push("/account");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-gray-400 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-xs">Verifying Administrator Privileges...</p>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Smartphone },
    { label: "Orders", href: "/admin/orders", icon: Package },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "AI Features", href: "/admin/ai-features", icon: Sparkles },
    { label: "Content & Guides", href: "/admin/content", icon: BookOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Admin Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-galaxy-900 to-galaxy-950 border border-indigo-500/30 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Galaxy AI Hub Admin Control</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                PORTAL ACTIVE
              </span>
            </div>
            <p className="text-xs text-gray-400">Authenticated as {user.name} ({user.email})</p>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs text-gray-300 hover:text-white flex items-center gap-1.5 self-start sm:self-auto bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </Link>
      </div>

      {/* Admin Horizontal Tab Menu */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-indigo-950/50 font-bold"
                  : "bg-galaxy-900/60 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Admin Content Area */}
      <div>{children}</div>
    </div>
  );
}
