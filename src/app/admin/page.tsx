"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Package,
  Users,
  Smartphone,
  Sparkles,
  BookOpen,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Loader2
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400 space-y-2">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
        <p className="text-xs">Computing live administrative analytics...</p>
      </div>
    );
  }

  const metrics = stats?.metrics || {
    totalRevenue: 0,
    orderCount: 0,
    userCount: 0,
    productCount: 0,
    featureCount: 0,
    articleCount: 0,
    pendingOrders: 0,
  };

  const monthlyStats = stats?.monthlyStats || [];

  return (
    <div className="space-y-10">
      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-galaxy-900/80 border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>Gross Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {formatPrice(metrics.totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% from last month
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-galaxy-900/80 border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>Total Orders</span>
            <div className="p-2 rounded-xl bg-cyan-950/60 text-galaxy-cyan border border-cyan-800/40">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {metrics.orderCount}
          </div>
          <div className="text-[11px] text-cyan-300 font-medium">
            {metrics.pendingOrders} orders currently processing
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-galaxy-900/80 border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>Registered Users</span>
            <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {metrics.userCount}
          </div>
          <div className="text-[11px] text-indigo-300 font-medium">
            Active customer accounts
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-galaxy-900/80 border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>AI Catalog Inventory</span>
            <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {metrics.productCount} <span className="text-xs text-gray-400 font-normal">devices</span> / {metrics.featureCount} <span className="text-xs text-gray-400 font-normal">AI tools</span>
          </div>
          <div className="text-[11px] text-purple-300 font-medium">
            {metrics.articleCount} published guides
          </div>
        </div>
      </div>

      {/* Monthly Sales Revenue Chart Simulation */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Monthly Revenue Trajectory</h3>
            <p className="text-xs text-gray-400">Aggregated sales performance across Galaxy AI devices</p>
          </div>
          <span className="text-xs text-galaxy-cyan font-semibold">Current Year 2025</span>
        </div>

        {/* Bar Chart Visualization */}
        <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2">
          {monthlyStats.map((item: any, i: number) => {
            const maxVal = Math.max(...monthlyStats.map((m: any) => m.revenue), 50000);
            const heightPercent = Math.max(12, Math.round((item.revenue / maxVal) * 100));

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-galaxy-cyan font-mono font-bold">
                  {formatPrice(item.revenue)}
                </div>
                <div
                  className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-indigo-600 via-blue-500 to-galaxy-cyan group-hover:brightness-125 transition-all shadow-lg"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[11px] text-gray-400 font-semibold">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Management Preview */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Customer Orders</h3>
            <p className="text-xs text-gray-400">Real-time transactions and fulfillment statuses</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
          >
            Manage All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentOrders?.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400">No orders placed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats?.recentOrders?.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-white">{ord.orderNumber}</td>
                    <td className="py-3.5 text-gray-300">
                      <div>{ord.customerName}</div>
                      <div className="text-[10px] text-gray-500">{ord.customerEmail}</div>
                    </td>
                    <td className="py-3.5 text-gray-400">{formatDate(ord.createdAt)}</td>
                    <td className="py-3.5 font-mono font-extrabold text-galaxy-cyan">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.orderStatus === "Delivered"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : ord.orderStatus === "Processing"
                            ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                            : ord.orderStatus === "Shipped"
                            ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                            : "bg-slate-800 text-gray-300"
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Review &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
