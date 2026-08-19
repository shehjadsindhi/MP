"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Settings,
  Clock,
  LogOut,
  Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { itemCount: wishCount } = useWishlist();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const res = await fetch("/api/orders");
          if (res.ok) {
            const data = await res.json();
            setOrders(data.orders || []);
          }
        } catch (e) {
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin" />
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, o) => (o.orderStatus !== "Cancelled" ? sum + o.total : sum), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      {/* User Header Profile Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-galaxy-900 via-galaxy-850 to-galaxy-900 border border-slate-800 p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-galaxy-cyan to-indigo-600 p-0.5 shadow-galaxy-cyan flex-shrink-0">
            <div className="w-full h-full bg-galaxy-950 rounded-[14px] flex items-center justify-center text-galaxy-cyan font-bold text-2xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user.name}</h1>
              {user.role === "ADMIN" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  ADMINISTRATOR
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            href="/account/profile"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-gray-200 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" /> Edit Profile
          </Link>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-xs font-semibold text-rose-300 border border-rose-800/40 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-galaxy-900/60 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-galaxy-cyan" /> Total Orders
          </div>
          <div className="text-2xl font-extrabold text-white">{orders.length}</div>
        </div>

        <div className="p-6 rounded-2xl bg-galaxy-900/60 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Saved AI Persona
          </div>
          <div className="text-xl font-bold text-cyan-200 truncate">
            {user.savedPersona || "Everyday User"}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-galaxy-900/60 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-400" /> Wishlist Items
          </div>
          <div className="text-2xl font-extrabold text-white">{wishCount}</div>
        </div>

        <div className="p-6 rounded-2xl bg-galaxy-900/60 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Total Investment
          </div>
          <div className="text-2xl font-extrabold text-galaxy-cyan font-mono">
            {formatPrice(totalSpent)}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">Recent Orders</h3>
            <p className="text-xs text-gray-400">Track shipments and view past invoices</p>
          </div>
          <Link
            href="/account/orders"
            className="text-xs font-bold text-galaxy-cyan hover:underline flex items-center gap-1"
          >
            View Full History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingOrders ? (
          <div className="py-8 text-center text-gray-400 text-xs">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-gray-400 space-y-3">
            <Package className="w-10 h-10 mx-auto text-gray-600" />
            <p className="text-sm">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/devices"
              className="inline-block px-5 py-2 rounded-xl bg-galaxy-cyan text-galaxy-950 font-bold text-xs"
            >
              Explore Flagship Devices
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">{order.orderNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.orderStatus === "Delivered"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : order.orderStatus === "Processing"
                          ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                          : "bg-slate-800 text-gray-300"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Placed on {formatDate(order.createdAt)} • {order.items?.length || 0} items
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-base font-extrabold text-galaxy-cyan font-mono">
                    {formatPrice(order.total)}
                  </div>
                  <Link
                    href="/account/orders"
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
                  >
                    Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
