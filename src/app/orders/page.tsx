"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ExternalLink,
  User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orderQuery, setOrderQuery] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoadingSearch(true);
    setSearchError("");
    setSearchedOrder(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderQuery.trim())}`);
      const data = await res.json();

      if (res.ok && data.order) {
        setSearchedOrder(data.order);
      } else {
        setSearchError(data.error || "Order not found. Please check your order ID or sign in to view your account orders.");
      }
    } catch (err) {
      setSearchError("Unable to connect to order tracking service. Please try again.");
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider shadow-galaxy-cyan">
          <Package className="w-3.5 h-3.5" /> Real-Time Order Tracking
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Track Your Galaxy Order
        </h1>
        <p className="text-sm text-gray-400">
          Enter your order ID (e.g. ORD-GALAXY-1001) or review your order status.
        </p>
      </div>

      {/* Authenticated Fast Navigation Banner */}
      {user && (
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-galaxy-900 to-galaxy-850 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-galaxy-cyan flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Signed in as {user.name}</h2>
              <p className="text-xs text-gray-400">View your complete order history and tracking in your dashboard.</p>
            </div>
          </div>
          <Link
            href="/account/orders"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-galaxy-cyan whitespace-nowrap"
          >
            <span>Go to My Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Lookup Card */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-galaxy-cyan" /> Look Up Order by ID
        </h2>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="Enter Order ID (e.g., ORD-GALAXY-1001)"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-galaxy-950 border border-slate-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-galaxy-cyan transition-colors"
          />
          <button
            type="submit"
            disabled={loadingSearch}
            className="px-6 py-3 rounded-xl bg-galaxy-cyan text-galaxy-950 font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loadingSearch ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Tracking...
              </>
            ) : (
              <>
                <Truck className="w-3.5 h-3.5" /> Track Package
              </>
            )}
          </button>
        </form>

        {searchError && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="space-y-1">
              <p>{searchError}</p>
              {!user && (
                <p>
                  Have an account?{" "}
                  <Link href={`/login?redirect=/orders`} className="text-galaxy-cyan underline font-semibold">
                    Sign in here
                  </Link>{" "}
                  to view all orders linked to your profile.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Searched Order Details */}
      {searchedOrder && (
        <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <div className="text-xs text-galaxy-cyan font-semibold">Order Number</div>
              <h2 className="text-xl font-bold text-white font-mono">{searchedOrder.orderNumber}</h2>
              <div className="text-xs text-gray-400">Placed on {formatDate(searchedOrder.createdAt)}</div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  searchedOrder.orderStatus === "Delivered"
                    ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-400"
                    : searchedOrder.orderStatus === "Cancelled"
                    ? "bg-rose-950/60 border border-rose-500/40 text-rose-400"
                    : "bg-cyan-950/60 border border-cyan-500/40 text-galaxy-cyan"
                }`}
              >
                {searchedOrder.orderStatus}
              </span>
              <span className="text-lg font-extrabold text-white">{formatPrice(searchedOrder.total)}</span>
            </div>
          </div>

          {/* Progress Tracker */}
          {searchedOrder.orderStatus !== "Cancelled" && (
            <div className="py-3">
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-galaxy-cyan to-blue-600 z-0 transition-all duration-500"
                  style={{
                    width: `${
                      (Math.max(0, STATUS_STEPS.indexOf(searchedOrder.orderStatus)) /
                        (STATUS_STEPS.length - 1)) *
                      100
                    }%`,
                  }}
                />

                {STATUS_STEPS.map((step, idx) => {
                  const currentIdx = STATUS_STEPS.indexOf(searchedOrder.orderStatus);
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;

                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? "bg-galaxy-cyan text-galaxy-950 shadow-galaxy-cyan"
                            : "bg-slate-800 border border-slate-700 text-gray-500"
                        } ${isCurrent ? "ring-4 ring-cyan-500/20" : ""}`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] mt-2 font-semibold ${
                          isDone ? "text-galaxy-cyan" : "text-gray-500"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordered Items</h3>
            <div className="divide-y divide-slate-800">
              {searchedOrder.items?.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-galaxy-950 border border-slate-800 flex items-center justify-center p-1.5 flex-shrink-0">
                      <img
                        src={item.productImage || "/images/nova_ultra.jpg"}
                        alt={item.productName}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.productName}</h4>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-white">{formatPrice(item.totalPrice)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
