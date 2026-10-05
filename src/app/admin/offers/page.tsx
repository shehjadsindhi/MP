"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  Percent,
  DollarSign,
  Loader2,
  Edit2,
  Sparkles,
  Search,
  Filter
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: "",
    description: "",
    code: "",
    discountPercent: 15,
    discountAmount: 0,
    minSpend: 0,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    eligibleCategory: "All",
    badge: "Limited Time Deal",
  });

  const { showToast } = useToast();

  const fetchOffers = async () => {
    try {
      const res = await fetch("/api/offers");
      if (res.ok) {
        const data = await res.json();
        setOffers(data.offers || []);
      }
    } catch (e) {
      showToast("Failed to load offers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.code) {
      showToast("Title and code are required", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast(`Offer ${form.code.toUpperCase()} created successfully!`, "success");
        setShowCreateModal(false);
        setForm({
          title: "",
          description: "",
          code: "",
          discountPercent: 15,
          discountAmount: 0,
          minSpend: 0,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          eligibleCategory: "All",
          badge: "Limited Time Deal",
        });
        fetchOffers();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to create offer", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (offer: any) => {
    try {
      const res = await fetch(`/api/offers/${offer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !offer.isActive }),
      });
      if (res.ok) {
        showToast(`Offer ${offer.code} ${offer.isActive ? "deactivated" : "activated"}!`, "info");
        setOffers((prev) =>
          prev.map((o) => (o.id === offer.id ? { ...o, isActive: !o.isActive } : o))
        );
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to update status", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    }
  };

  const handleDeleteOffer = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete offer ${code}?`)) return;

    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast(`Offer ${code} deleted.`, "info");
        setOffers((prev) => prev.filter((o) => o.id !== id));
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to delete offer", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-indigo-400">Offers & Promotions</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Promotional Offers & Codes</h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-indigo-950"
        >
          <Plus className="w-4 h-4" /> Create New Offer
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-gray-400 space-y-2">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-xs">Loading active and scheduled promotions...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20 bg-galaxy-900/40 rounded-3xl border border-slate-800 space-y-4">
          <Tag className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No promotional offers created</h3>
          <p className="text-xs text-gray-400">Launch campaigns and coupon discounts for Galaxy devices.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Create First Offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const isExpired = new Date(offer.validUntil) < new Date();
            return (
              <div
                key={offer.id}
                className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 flex flex-col justify-between space-y-5 shadow-xl transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                      {offer.code}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(offer)}
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold border transition-colors ${
                        offer.isActive && !isExpired
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                          : "bg-rose-950/80 text-rose-300 border-rose-800"
                      }`}
                    >
                      {isExpired ? "Expired" : offer.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{offer.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-galaxy-950 border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Discount:</span>
                      <span className="text-white font-bold">
                        {offer.discountPercent > 0 ? `${offer.discountPercent}% Off` : `$${offer.discountAmount} Off`}
                      </span>
                    </div>
                    {offer.minSpend > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Min Spend:</span>
                        <span className="text-gray-300">{formatPrice(offer.minSpend)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Eligible Category:</span>
                      <span className="text-cyan-400 font-medium">{offer.eligibleCategory || "All"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Expires:</span>
                      <span className={isExpired ? "text-rose-400 font-semibold" : "text-gray-300"}>
                        {formatDate(offer.validUntil)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">
                    Badge: <strong className="text-gray-400">{offer.badge || "None"}</strong>
                  </span>
                  <button
                    onClick={() => handleDeleteOffer(offer.id, offer.code)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
                    title="Delete offer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Offer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-galaxy-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-400" /> Create Promotion Offer
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Promo Code</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., GALAXY25"
                    className="w-full bg-galaxy-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-indigo-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Discount %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.discountPercent}
                    onChange={(e) => setForm({ ...form, discountPercent: parseInt(e.target.value) || 0 })}
                    className="w-full bg-galaxy-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., 25% Off Wearables & Watch Ultra"
                  className="w-full bg-galaxy-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Offer details and terms..."
                  className="w-full bg-galaxy-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/40 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Min Order Spend ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.minSpend}
                    onChange={(e) => setForm({ ...form, minSpend: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-galaxy-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Valid Until</label>
                  <input
                    type="date"
                    required
                    value={form.validUntil}
                    onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                    className="w-full bg-galaxy-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Eligible Category</label>
                  <select
                    value={form.eligibleCategory}
                    onChange={(e) => setForm({ ...form, eligibleCategory: e.target.value })}
                    className="w-full bg-galaxy-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/40"
                  >
                    <option value="All">All Categories</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Watches">Watches</option>
                    <option value="Audio">Audio</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Card Badge Tag</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="e.g., Limited Time Deal"
                    className="w-full bg-galaxy-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/40"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-gray-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-xs disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Save Promotion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
