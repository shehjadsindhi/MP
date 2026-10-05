"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign, Package, Users, Smartphone, Sparkles, BookOpen,
  TrendingUp, ArrowRight, ArrowUpRight, ArrowDownRight,
  CheckCircle2, Clock, Truck, AlertCircle, Loader2, Activity,
  ShoppingBag, Star, Zap, BarChart2, Tag
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  Delivered:  { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2, label: "Delivered" },
  Processing: { color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",         icon: Activity,      label: "Processing" },
  Shipped:    { color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",   icon: Truck,         label: "Shipped" },
  Pending:    { color: "text-amber-400 bg-amber-500/10 border-amber-500/20",      icon: Clock,         label: "Pending" },
  Cancelled:  { color: "text-rose-400 bg-rose-500/10 border-rose-500/20",         icon: AlertCircle,   label: "Cancelled" },
};

const QUICK_LINKS = [
  { label: "Add Product", href: "/admin/products", icon: Smartphone, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  { label: "View Orders", href: "/admin/orders",   icon: Package,    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { label: "Manage Users", href: "/admin/users",   icon: Users,      color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  { label: "AI Features",  href: "/admin/ai-features", icon: Sparkles, color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20" },
  { label: "Analytics",    href: "/admin/analytics", icon: BarChart2, color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
  { label: "Offers",       href: "/admin/offers",   icon: Tag,        color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setStats(d); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-xs text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  const m = stats?.metrics || { totalRevenue: 0, orderCount: 0, userCount: 0, productCount: 0, featureCount: 0, articleCount: 0, pendingOrders: 0 };
  const monthly = stats?.monthlyStats || [];
  const maxRevenue = Math.max(...monthly.map((x: any) => x.revenue), 1);

  const kpis = [
    {
      label: "Gross Revenue",
      value: formatPrice(m.totalRevenue),
      sub: "+18.4% from last month",
      icon: DollarSign,
      trend: "up",
      color: "emerald",
      bg: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-500/20",
      iconBg: "bg-emerald-500/15 text-emerald-400",
    },
    {
      label: "Total Orders",
      value: m.orderCount,
      sub: `${m.pendingOrders} currently processing`,
      icon: ShoppingBag,
      trend: "up",
      color: "cyan",
      bg: "from-cyan-500/10 to-blue-500/5",
      border: "border-cyan-500/20",
      iconBg: "bg-cyan-500/15 text-cyan-400",
    },
    {
      label: "Registered Users",
      value: m.userCount,
      sub: "Active customer accounts",
      icon: Users,
      trend: "up",
      color: "violet",
      bg: "from-violet-500/10 to-purple-500/5",
      border: "border-violet-500/20",
      iconBg: "bg-violet-500/15 text-violet-400",
    },
    {
      label: "Catalog",
      value: `${m.productCount} devices`,
      sub: `${m.featureCount} AI tools · ${m.articleCount} guides`,
      icon: Sparkles,
      trend: "neutral",
      color: "fuchsia",
      bg: "from-fuchsia-500/10 to-pink-500/5",
      border: "border-fuchsia-500/20",
      iconBg: "bg-fuchsia-500/15 text-fuchsia-400",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-xs text-gray-600 mt-0.5">Real-time platform analytics and management</p>
        </div>
        <span className="text-[10px] text-gray-700 font-mono hidden sm:inline">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${k.bg} border ${k.border} p-5 space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">{k.label}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${k.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">{k.value}</p>
                <p className={`text-[11px] mt-1 flex items-center gap-1 ${k.trend === "up" ? "text-emerald-400" : "text-gray-600"}`}>
                  {k.trend === "up" && <TrendingUp className="w-3 h-3" />}
                  {k.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Monthly Revenue</h2>
              <p className="text-[11px] text-gray-600 mt-0.5">Aggregated Galaxy AI device sales</p>
            </div>
            <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
              {new Date().getFullYear()}
            </span>
          </div>
          <div className="h-44 flex items-end gap-1.5">
            {monthly.length === 0 ? (
              <div className="w-full flex items-center justify-center text-xs text-gray-700">No revenue data yet</div>
            ) : (
              monthly.map((item: any, i: number) => {
                const pct = Math.max(6, Math.round((item.revenue / maxRevenue) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-cyan-400 font-mono whitespace-nowrap">
                      {formatPrice(item.revenue)}
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600/80 to-cyan-400/60 group-hover:from-indigo-500 group-hover:to-cyan-300 transition-all duration-300"
                      style={{ height: `${pct}%` }}
                    />
                    <span className="text-[9px] text-gray-700 font-medium">{item.month}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white">Quick Actions</h2>
            <p className="text-[11px] text-gray-600 mt-0.5">Jump to key sections</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_LINKS.map((ql) => {
              const Icon = ql.icon;
              return (
                <Link
                  key={ql.href}
                  href={ql.href}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center text-[11px] font-semibold transition-all hover:scale-105 ${ql.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{ql.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Orders</h2>
            <p className="text-[11px] text-gray-600 mt-0.5">Latest customer transactions</p>
          </div>
          <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!stats?.recentOrders?.length ? (
          <div className="py-12 text-center text-xs text-gray-700">No orders placed yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {["Order", "Customer", "Date", "Total", "Status", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-gray-700 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((ord: any) => {
                  const sc = STATUS_CONFIG[ord.orderStatus] || STATUS_CONFIG["Pending"];
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={ord.id} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-white text-[11px]">{ord.orderNumber}</td>
                      <td className="px-5 py-4">
                        <p className="text-gray-300 font-medium">{ord.customerName}</p>
                        <p className="text-gray-700 text-[10px]">{ord.customerEmail}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{formatDate(ord.createdAt)}</td>
                      <td className="px-5 py-4 font-mono font-bold text-emerald-400">{formatPrice(ord.total)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${sc.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link href="/admin/orders" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 justify-end">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
