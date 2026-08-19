"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, ArrowLeft, ArrowRight, Truck, CheckCircle2, Clock, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

export default function AccountOrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/account" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-galaxy-cyan">Orders</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Your Order History</h1>
        </div>

        <span className="text-xs text-gray-400">
          Showing <strong className="text-white">{orders.length}</strong> orders
        </span>
      </div>

      {loadingOrders ? (
        <div className="text-center py-20 text-gray-400 space-y-2">
          <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin mx-auto" />
          <p className="text-xs">Fetching your Galaxy orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-galaxy-900/40 rounded-3xl border border-slate-800 space-y-4">
          <Package className="w-12 h-12 text-gray-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">No orders found</h2>
          <p className="text-xs text-gray-400">You have not placed any orders yet.</p>
          <Link
            href="/devices"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-galaxy-cyan text-galaxy-950 font-bold text-xs"
          >
            Explore Devices <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            const currentStepIdx = STATUS_STEPS.indexOf(order.orderStatus);
            const isCancelled = order.orderStatus === "Cancelled";

            return (
              <div
                key={order.id}
                className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl"
              >
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold font-mono text-galaxy-cyan">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.orderStatus === "Delivered"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : order.orderStatus === "Processing"
                            ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                            : order.orderStatus === "Shipped"
                            ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                            : "bg-slate-800 text-gray-300"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Ordered on {formatDate(order.createdAt)} • Payment: {order.paymentMethod}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Total Amount</span>
                    <span className="text-2xl font-extrabold text-white font-mono">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Timeline Bar */}
                {!isCancelled && (
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {STATUS_STEPS.map((s, idx) => {
                        const isDone = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;
                        return (
                          <div key={s} className="space-y-1.5">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isDone ? "bg-gradient-to-r from-galaxy-cyan to-blue-500" : "bg-slate-800"
                              }`}
                            />
                            <span
                              className={`text-[11px] block font-semibold ${
                                isCurrent
                                  ? "text-galaxy-cyan"
                                  : isDone
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              }`}
                            >
                              {s}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Order Items ({order.items?.length || 0})
                  </h4>
                  <div className="divide-y divide-slate-800">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          {item.productImage && (
                            <div className="w-12 h-12 rounded-xl bg-galaxy-950 p-1 flex items-center justify-center flex-shrink-0 border border-slate-800">
                              <img src={item.productImage} alt={item.productName} className="max-h-full max-w-full object-contain" />
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-white block">{item.productName}</span>
                            <span className="text-gray-400 text-[11px]">
                              {item.selectedColor && `${item.selectedColor} • `}
                              {item.selectedStorage && `${item.selectedStorage} • `}
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>

                        <span className="font-mono font-bold text-white">{formatPrice(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping info footer */}
                <div className="p-4 rounded-2xl bg-galaxy-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-400 gap-2">
                  <div>
                    <span className="font-semibold text-gray-300">Ship To: </span>
                    <span>{order.customerName} ({order.shippingAddress})</span>
                  </div>
                  <span className="text-emerald-400 font-medium">Payment Status: {order.paymentStatus}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
