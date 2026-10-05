"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, CheckCircle2, Clock, Truck, AlertCircle, Loader2, Package, Activity } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

const STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLE: Record<string, string> = {
  Delivered:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Processing: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Shipped:    "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Pending:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Cancelled:  "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const SELECT_STYLE: Record<string, string> = {
  Delivered:  "bg-emerald-950 text-emerald-300 border-emerald-700",
  Processing: "bg-cyan-950 text-cyan-300 border-cyan-700",
  Shipped:    "bg-indigo-950 text-indigo-300 border-indigo-700",
  Pending:    "bg-amber-950 text-amber-300 border-amber-700",
  Cancelled:  "bg-rose-950 text-rose-300 border-rose-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders?all=true");
      if (res.ok) { const d = await res.json(); setOrders(d.orders || []); }
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderStatus: status }) });
      if (res.ok) { showToast(`Status → ${status}`, "success"); setOrders((prev) => prev.map((o) => o.id === id ? { ...o, orderStatus: status } : o)); }
    } catch { showToast("Update failed", "error"); } finally { setUpdatingId(null); }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "All" || o.orderStatus === statusFilter;
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = STATUSES.slice(1).reduce<Record<string, number>>((acc, s) => { acc[s] = orders.filter((o) => o.orderStatus === s).length; return acc; }, {});

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Orders</h1>
          <p className="text-xs text-gray-600 mt-0.5">{orders.length} total orders</p>
        </div>
      </div>

      {/* Status summary pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              statusFilter === s
                ? s === "All" ? "bg-indigo-600 text-white border-indigo-600" : `border ${STATUS_STYLE[s]}`
                : "bg-white/[0.03] text-gray-600 border-white/[0.07] hover:text-gray-300"
            }`}
          >
            {s}
            {s !== "All" && counts[s] !== undefined && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusFilter === s ? "bg-white/20" : "bg-white/[0.05]"}`}>{counts[s]}</span>
            )}
          </button>
        ))}

        {/* Search */}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />
          <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/60 transition-colors w-52" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-gray-700">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            <span className="text-xs">Loading orders...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="w-10 h-10 text-gray-800 mx-auto mb-3" />
            <p className="text-sm text-gray-700">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  {["Order #", "Customer", "Items", "Date", "Total", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-gray-700 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((ord) => (
                  <tr key={ord.id} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-white text-[13px] whitespace-nowrap">{ord.orderNumber}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white text-[13px]">{ord.customerName}</p>
                      <p className="text-[11px] text-gray-600">{ord.customerEmail}</p>
                      {ord.shippingAddress && <p className="text-[10px] text-gray-700 truncate max-w-[160px]">{ord.shippingAddress}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white font-medium">{ord.items?.length || 0} items</p>
                      <p className="text-[10px] text-gray-700 truncate max-w-[120px]">{ord.items?.map((i: any) => i.productName).join(", ")}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap text-[13px]">{formatDate(ord.createdAt)}</td>
                    <td className="px-5 py-4 font-mono font-bold text-emerald-400 text-[13px] whitespace-nowrap">{formatPrice(ord.total)}</td>
                    <td className="px-5 py-4">
                      <select
                        value={ord.orderStatus}
                        disabled={updatingId === ord.id}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold border focus:outline-none cursor-pointer disabled:opacity-50 ${SELECT_STYLE[ord.orderStatus] || "bg-slate-900 text-gray-300 border-slate-700"}`}
                      >
                        {["Pending","Processing","Shipped","Delivered","Cancelled"].map((s) => <option key={s}>{s}</option>)}
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
