"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Loader2,
  LogIn,
  UserPlus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AccountDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const { itemCount: wishCount } = useWishlist();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

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
    } else {
      setLoadingOrders(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin" />
      </div>
    );
  }

  // Guest State
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 min-h-[65vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-galaxy-cyan">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Sign In to Your Account</h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Access your order tracking, customized AI recommendations, wishlist, and profile settings.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/login?redirect=/account"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 hover:text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Create Account
          </Link>
        </div>
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

          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-xs font-semibold text-indigo-300 border border-indigo-700/50 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
            </Link>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-xs font-semibold text-rose-300 border border-rose-800/40 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Account Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-galaxy-900/80 border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>Total Orders</span>
            <div className="p-2 rounded-xl bg-cyan-950/60 text-galaxy-cyan border border-cyan-800/40">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{orders.length}</div>
          <Link
            href="/account/orders"
            className="text-[11px] text-galaxy-cyan hover:underline font-semibold flex items-center gap-1"
          >
            View all orders &rarr;
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-galaxy-900/80 border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>Wishlist Items</span>
            <div className="p-2 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{wishCount}</div>
          <Link
            href="/wishlist"
            className="text-[11px] text-rose-400 hover:underline font-semibold flex items-center gap-1"
          >
            View saved devices &rarr;
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-galaxy-900/80 border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>Total Expenditure</span>
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {formatPrice(totalSpent)}
          </div>
          <span className="text-[11px] text-gray-500">Across verified orders</span>
        </div>

        <div className="p-6 rounded-3xl bg-galaxy-900/80 border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>Configured Persona</span>
            <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white truncate">
            {user.savedPersona || "Everyday User"}
          </div>
          <Link
            href="/account/profile"
            className="text-[11px] text-indigo-400 hover:underline font-semibold flex items-center gap-1"
          >
            Change preferences &rarr;
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-galaxy-cyan" /> Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-xs text-galaxy-cyan hover:underline font-semibold flex items-center gap-1"
          >
            View Complete History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingOrders ? (
          <div className="py-12 text-center text-gray-400">
            <Loader2 className="w-6 h-6 text-galaxy-cyan animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-10 rounded-3xl bg-galaxy-900/40 border border-slate-800 text-center space-y-3">
            <Package className="w-10 h-10 text-gray-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No orders placed yet</h3>
            <p className="text-xs text-gray-400">Explore our Galaxy flagship devices and interactive tools.</p>
            <Link
              href="/devices"
              className="inline-block px-5 py-2 rounded-xl bg-galaxy-cyan text-galaxy-950 font-bold text-xs"
            >
              Explore Devices
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl bg-galaxy-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-white">{order.orderNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.orderStatus === "Delivered"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-cyan-950 text-cyan-300 border border-cyan-800"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Placed on {formatDate(order.createdAt)} • {order.items?.length || 1} items
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <span className="text-sm font-bold text-white font-mono">
                    {formatPrice(order.total)}
                  </span>
                  <Link
                    href="/account/orders"
                    className="text-xs text-galaxy-cyan hover:underline font-semibold"
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
