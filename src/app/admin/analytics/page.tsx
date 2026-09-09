"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, ShoppingBag, Package, Star, MessageSquare, Newspaper, Zap, TrendingUp, DollarSign, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    lowStockProducts: number;
    totalReviews: number;
    totalAIFeatures: number;
    totalArticles: number;
    newsletterSubscribers: number;
  };
  recentOrders: any[];
  topProducts: any[];
  aiUsage: Record<string, number>;
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      const fetchAnalytics = async () => {
        try {
          const res = await fetch("/api/admin/analytics");
          if (res.ok) {
            const result = await res.json();
            setData(result);
          }
        } catch (e) {
          console.warn("Failed to fetch analytics:", e);
        } finally {
          setLoading(false);
        }
      };
      fetchAnalytics();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin" />
      </div>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-xs">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin" />
      </div>
    );
  }

  const stats = data?.overview || {
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalReviews: 0,
    totalAIFeatures: 0,
    totalArticles: 0,
    newsletterSubscribers: 0,
  };
  const maxAIUsage = Math.max(...Object.values(data?.aiUsage || {}), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/admin" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Admin
            </Link>
            <span>/</span>
            <span className="text-galaxy-cyan">Analytics Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Analytics Overview</h1>
        </div>
        <div className="text-xs text-gray-400">
          Last 30 days
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="Total Users" value={stats.totalUsers} icon={<Users className="w-5 h-5" />} color="text-cyan-400" />
        <MetricCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingBag className="w-5 h-5" />} color="text-emerald-400" />
        <MetricCard title="Revenue" value={`$${(stats.totalRevenue || 0).toFixed(0)}`} icon={<DollarSign className="w-5 h-5" />} color="text-amber-400" />
        <MetricCard title="Products" value={stats.totalProducts} icon={<Package className="w-5 h-5" />} color="text-indigo-400" />
        <MetricCard title="Reviews" value={stats.totalReviews} icon={<Star className="w-5 h-5" />} color="text-rose-400" />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Active Users (30d)" value={stats.activeUsers} icon={<TrendingUp className="w-5 h-5" />} color="text-emerald-400" />
        <MetricCard title="Low Stock Items" value={stats.lowStockProducts} icon={<AlertTriangle className="w-5 h-5" />} color="text-amber-400" />
        <MetricCard title="Newsletter Subs" value={stats.newsletterSubscribers} icon={<Newspaper className="w-5 h-5" />} color="text-indigo-400" />
        <MetricCard title="AI Features" value={stats.totalAIFeatures} icon={<Zap className="w-5 h-5" />} color="text-cyan-400" />
      </div>

      {/* AI Usage Chart */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white">AI Usage (Last 30 Days)</h2>
        <div className="space-y-4">
          {Object.entries(data?.aiUsage || {}).map(([tool, count]) => {
            const percentage = maxAIUsage > 0 ? (count / maxAIUsage) * 100 : 0;
            return (
              <div key={tool} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-white capitalize">{tool.replace(/-/g, " ")}</span>
                  <span className="text-xs text-gray-400">{count} uses</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-galaxy-cyan to-blue-600 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white">Recent Orders</h2>
        <div className="space-y-3">
          {data?.recentOrders?.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-galaxy-950 border border-slate-800/60">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{order.user?.name || "Guest"}</div>
                <div className="text-xs text-gray-400">{order.user?.email}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-galaxy-cyan">${order.total.toFixed(2)}</div>
                <div className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white">Top Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.topProducts?.map((product) => (
            <div key={product.id} className="p-4 rounded-2xl bg-galaxy-950 border border-slate-800 flex items-center gap-4">
              <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-contain" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{product.name}</div>
                <div className="text-xs text-galaxy-cyan">${product.price.toFixed(2)}</div>
                <div className="text-[10px] text-amber-400">★ {product.rating.toFixed(1)} ({product.reviewCount})</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: string }) {
  return (
    <div className="p-5 rounded-2xl bg-galaxy-900/80 border border-slate-800 space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{title}</span>
        <div className={`p-2 rounded-xl bg-slate-800 ${color}`}>{icon}</div>
      </div>
      <div className="text-2xl font-extrabold text-white">{value}</div>
    </div>
  );
}
