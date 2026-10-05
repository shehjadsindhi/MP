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
  ShieldCheck,
  ShieldAlert,
  Loader2,
  LogIn,
  BarChart3,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
  Settings,
  ChevronRight,
  Tag,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, color: "indigo", description: "Overview & KPIs" },
  { label: "Products", href: "/admin/products", icon: Smartphone, color: "cyan", description: "Inventory management" },
  { label: "Orders", href: "/admin/orders", icon: Package, color: "emerald", description: "Fulfillment center" },
  { label: "Users", href: "/admin/users", icon: Users, color: "violet", description: "Customer accounts" },
  { label: "AI Features", href: "/admin/ai-features", icon: Sparkles, color: "fuchsia", description: "Feature studio" },
  { label: "Content", href: "/admin/content", icon: BookOpen, color: "amber", description: "Articles & guides" },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, color: "sky", description: "Revenue insights" },
  { label: "Offers", href: "/admin/offers", icon: Tag, color: "rose", description: "Promotions & deals" },
  { label: "Settings", href: "/admin/settings", icon: Settings, color: "slate", description: "System config" },
];

type ColorKey = "indigo" | "cyan" | "emerald" | "violet" | "fuchsia" | "amber" | "sky" | "rose" | "slate";

const colorMap: Record<ColorKey, { text: string; border: string; activeBg: string; dot: string }> = {
  indigo:  { text: "text-indigo-400",  border: "border-indigo-500/30",  activeBg: "bg-indigo-500/15",  dot: "bg-indigo-400" },
  cyan:    { text: "text-cyan-400",    border: "border-cyan-500/30",    activeBg: "bg-cyan-500/15",    dot: "bg-cyan-400" },
  emerald: { text: "text-emerald-400", border: "border-emerald-500/30", activeBg: "bg-emerald-500/15", dot: "bg-emerald-400" },
  violet:  { text: "text-violet-400",  border: "border-violet-500/30",  activeBg: "bg-violet-500/15",  dot: "bg-violet-400" },
  fuchsia: { text: "text-fuchsia-400", border: "border-fuchsia-500/30", activeBg: "bg-fuchsia-500/15", dot: "bg-fuchsia-400" },
  amber:   { text: "text-amber-400",   border: "border-amber-500/30",   activeBg: "bg-amber-500/15",   dot: "bg-amber-400" },
  sky:     { text: "text-sky-400",     border: "border-sky-500/30",     activeBg: "bg-sky-500/15",     dot: "bg-sky-400" },
  rose:    { text: "text-rose-400",    border: "border-rose-500/30",    activeBg: "bg-rose-500/15",    dot: "bg-rose-400" },
  slate:   { text: "text-slate-400",   border: "border-slate-500/30",   activeBg: "bg-slate-500/15",   dot: "bg-slate-400" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { showToast } = useToast();
  const [authTimedOut, setAuthTimedOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => setAuthTimedOut(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const update = () =>
      setCurrentTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  if (pathname === "/admin/login") return <>{children}</>;

  if (isLoading && !authTimedOut) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#080c14] border-2 border-indigo-500/40 flex items-center justify-center">
            <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
          </span>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-white">Verifying Access</p>
          <p className="text-xs text-gray-600 mt-1">Checking administrator privileges...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-8">
          <div className="relative mx-auto w-20 h-20">
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <ShieldAlert className="w-9 h-9 text-indigo-400" />
            </div>
            <div className="absolute inset-0 rounded-3xl bg-indigo-500/10 blur-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Admin Access Required</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              You need an authorized administrator account to access the control center.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/login"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Sign In as Admin
            </Link>
            <Link
              href="/"
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-medium text-sm border border-white/10 transition-colors"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-8">
          <div className="relative mx-auto w-20 h-20">
            <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <ShieldAlert className="w-9 h-9 text-rose-400" />
            </div>
            <div className="absolute inset-0 rounded-3xl bg-rose-500/10 blur-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Access Denied</h2>
            <p className="text-sm text-gray-500 mt-2">
              Signed in as <span className="text-white font-semibold">{user.name}</span>. Administrator role required.
            </p>
          </div>
          <Link
            href="/account"
            className="block w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-medium text-sm border border-white/10 transition-colors"
          >
            Go to Your Account
          </Link>
        </div>
      </div>
    );
  }

  const handleAdminLogout = async () => {
    await logout();
    showToast("Admin session ended", "info");
    router.push("/admin/login");
  };

  const currentNav = navItems.find((n) =>
    n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
  );
  const currentLabel = currentNav?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-[#080c14] text-gray-100 flex">
      {/* ── Sidebar ── */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0b0f1a] border-r border-white/[0.06] transition-all duration-300",
          sidebarCollapsed ? "w-[68px]" : "w-60",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className={["flex items-center gap-3 px-4 h-14 border-b border-white/[0.06] flex-shrink-0", sidebarCollapsed ? "justify-center" : ""].join(" ")}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-900/50">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <p className="text-[13px] font-bold text-white">Galaxy AI</p>
              <p className="text-[10px] text-gray-600">Control Center</p>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {!sidebarCollapsed && (
            <p className="px-3 pb-2 pt-1 text-[9px] font-bold text-gray-700 uppercase tracking-widest">Menu</p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const c = colorMap[item.color as ColorKey];
            return (
              <Link
                key={item.href}
                href={item.href}
                title={sidebarCollapsed ? item.label : undefined}
                className={[
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                  isActive ? `${c.activeBg} ${c.text} border ${c.border}` : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.05]",
                  sidebarCollapsed ? "justify-center" : "",
                ].join(" ")}
              >
                {isActive && (
                  <span className={["absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full", c.dot].join(" ")} />
                )}
                <Icon className={["w-4 h-4 flex-shrink-0", isActive ? c.text : "text-gray-600 group-hover:text-gray-400"].join(" ")} />
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <span className="block leading-tight">{item.label}</span>
                    {!isActive && (
                      <span className="block text-[10px] text-gray-700 group-hover:text-gray-600 font-normal">{item.description}</span>
                    )}
                  </div>
                )}
                {isActive && !sidebarCollapsed && <ChevronRight className={["w-3 h-3 flex-shrink-0", c.text].join(" ")} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-white/[0.06] space-y-1.5">
          {!sidebarCollapsed && (
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-gray-600 hover:text-gray-300 text-xs font-medium transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
              <span className="truncate">View Storefront</span>
            </Link>
          )}
          <div className={["flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]", sidebarCollapsed ? "justify-center" : ""].join(" ")}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/40 to-violet-500/40 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xs flex-shrink-0">
              {(user.name || "A").charAt(0).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-600 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleAdminLogout}
                  className="p-1.5 rounded-lg text-gray-700 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-[#0b0f1a] border border-white/[0.12] items-center justify-center text-gray-600 hover:text-gray-300 transition-colors shadow-lg"
        >
          <ChevronRight className={["w-3 h-3 transition-transform duration-300", sidebarCollapsed ? "" : "rotate-180"].join(" ")} />
        </button>
      </aside>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden" />
      )}

      {/* ── Main ── */}
      <div className={["flex-1 flex flex-col min-w-0 transition-all duration-300", sidebarCollapsed ? "md:ml-[68px]" : "md:ml-60"].join(" ")}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 md:px-6 bg-[#080c14]/80 backdrop-blur-md border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/[0.05] text-gray-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-700">Admin</span>
              <ChevronRight className="w-3 h-3 text-gray-800" />
              <span className="font-semibold text-gray-300">{currentLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden md:inline">Online</span>
            </div>
            {currentTime && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-600 text-[11px] font-mono">
                <Zap className="w-3 h-3 text-indigo-500" />
                {currentTime}
              </div>
            )}
            <button className="relative p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-500 hover:text-white hover:bg-white/[0.08] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
            </button>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-[10px]">
                {(user.name || "A").charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-indigo-300 hidden sm:inline">{user.name?.split(" ")[0]}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>

        <footer className="px-6 py-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-gray-800">
          <span>Galaxy AI Hub — Control Center v2.0</span>
          <span className="font-mono hidden sm:inline">Knox Security · Quantum NPU Active</span>
        </footer>
      </div>
    </div>
  );
}
