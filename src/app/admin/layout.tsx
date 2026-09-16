"use client";

import React, { useEffect, useState } from "react";
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
  ShieldAlert,
  Loader2,
  LogIn,
  BarChart3,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Cpu,
  Bell
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { showToast } = useToast();
  const [authTimedOut, setAuthTimedOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthTimedOut(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // If on the dedicated admin login page, render children directly without admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading && !authTimedOut) {
    return (
      <div className="min-h-screen bg-galaxy-950 flex flex-col items-center justify-center text-gray-400 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-xs">Verifying Administrator Privileges...</p>
      </div>
    );
  }

  // Guest / Unauthenticated State
  if (!user) {
    return (
      <div className="min-h-screen bg-galaxy-950 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center space-y-6 rounded-3xl bg-galaxy-900/90 border border-indigo-500/30 p-8 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-950">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Administrator Access Required</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              You must be authenticated with an authorized administrator account to access the control center.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/admin/login"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-indigo-950"
            >
              <LogIn className="w-4 h-4" /> Go to Admin Login
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 text-gray-300 hover:text-white font-medium text-xs border border-slate-700 transition-colors"
            >
              Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Non-Admin User State
  if (user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-galaxy-950 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center space-y-6 rounded-3xl bg-galaxy-900/90 border border-rose-500/30 p-8 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Access Denied</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Logged in as <strong className="text-white">{user.name}</strong> ({user.email}). Current role: <span className="text-rose-400 font-bold">{user.role}</span>. Administrator privileges are required to view the control center.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/account"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700"
            >
              Go to Customer Account
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-galaxy-cyan text-galaxy-950 font-bold text-xs"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAdminLogout = async () => {
    await logout();
    showToast("Admin session ended successfully", "info");
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products & Inventory", href: "/admin/products", icon: Smartphone },
    { label: "Orders & Fulfillment", href: "/admin/orders", icon: Package },
    { label: "Users & Roles", href: "/admin/users", icon: Users },
    { label: "AI Feature Studio", href: "/admin/ai-features", icon: Sparkles },
    { label: "Content & Guides", href: "/admin/content", icon: BookOpen },
    { label: "Analytics & Revenue", href: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-galaxy-950 text-gray-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3.5 bg-galaxy-900 border-b border-indigo-500/20 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm text-white tracking-wide">
            Galaxy <span className="text-indigo-400">Admin</span>
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-gray-300 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-indigo-500/20 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Brand Logo */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-0.5 shadow-lg shadow-indigo-950">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-wide text-white">GALAXY AI</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">Control Center v1.0</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto" aria-label="Admin Sidebar">
          <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Management Portal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-950/60 font-bold"
                    : "text-gray-400 hover:text-white hover:bg-slate-900/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Card & Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-galaxy-950/50">
          <Link
            href="/"
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5 text-galaxy-cyan" />
            <span>View Public Storefront</span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs flex-shrink-0">
                {(user.name || "A").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleAdminLogout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
              title="Sign Out"
              aria-label="Sign Out of Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-slate-950/60 backdrop-blur-md border-b border-indigo-500/20 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Admin Portal</span>
            <span className="text-xs text-gray-600">/</span>
            <span className="text-xs font-bold text-indigo-400 capitalize">
              {pathname === "/admin" ? "Dashboard" : pathname.replace("/admin/", "").replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admin Gateway: Secure</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Quantum NPU Online</span>
            </div>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </div>
  );
}
