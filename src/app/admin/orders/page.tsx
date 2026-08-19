"use client";

import React, { useState, useEffect } from "react";
import { Package, Search, Filter, CheckCircle2, Clock, Truck, XCircle, Loader2 } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

const STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders?all=true");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        showToast(`Order status changed to: ${newStatus}`, "success");
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (e) {
      showToast("Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((ord) => {
    const matchesStatus = statusFilter === "All" || ord.orderStatus === statusFilter;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, customer name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-galaxy-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-galaxy-900 hover:bg-slate-800 text-gray-400 border border-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto mb-2" />
            Loading orders...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">No orders match your filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-galaxy-950/80 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Customer & Destination</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 pr-6">Status Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-white">
                      {ord.orderNumber}
                    </td>
                    <td className="p-4 text-gray-300">
                      <div className="font-bold text-white">{ord.customerName}</div>
                      <div className="text-[10px] text-gray-400">{ord.customerEmail}</div>
                      <div className="text-[10px] text-gray-500 line-clamp-1">{ord.shippingAddress}</div>
                    </td>
                    <td className="p-4 text-gray-300">
                      <span className="font-bold">{ord.items?.length || 0} items</span>
                      <div className="text-[10px] text-gray-500 line-clamp-1">
                        {ord.items?.map((i: any) => i.productName).join(", ")}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{formatDate(ord.createdAt)}</td>
                    <td className="p-4 font-mono font-extrabold text-galaxy-cyan">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="p-4 pr-6">
                      <select
                        value={ord.orderStatus}
                        disabled={updatingId === ord.id}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none border ${
                          ord.orderStatus === "Delivered"
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                            : ord.orderStatus === "Processing"
                            ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                            : ord.orderStatus === "Shipped"
                            ? "bg-indigo-950 text-indigo-300 border-indigo-800"
                            : ord.orderStatus === "Cancelled"
                            ? "bg-rose-950 text-rose-300 border-rose-800"
                            : "bg-slate-900 text-gray-300 border-slate-700"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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
