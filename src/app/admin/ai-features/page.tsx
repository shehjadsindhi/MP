"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Plus, Edit2, Trash2, Search, X, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function AdminAIFeaturesPage() {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    category: "Productivity",
    badge: "Quantum NPU",
    demoTab: "notes",
    shortDesc: "",
    fullDesc: "",
  });

  const fetchFeatures = async () => {
    try {
      const res = await fetch("/api/ai-features");
      if (res.ok) {
        const data = await res.json();
        setFeatures(data.features || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const openCreateModal = () => {
    setEditingFeature(null);
    setForm({
      name: "",
      category: "Productivity",
      badge: "Quantum NPU",
      demoTab: "notes",
      shortDesc: "",
      fullDesc: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (feat: any) => {
    setEditingFeature(feat);
    setForm({
      name: feat.name,
      category: feat.category,
      badge: feat.badge || "",
      demoTab: feat.demoTab || "notes",
      shortDesc: feat.shortDesc || "",
      fullDesc: feat.fullDesc || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this AI Feature?")) return;
    try {
      const res = await fetch(`/api/ai-features/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("AI Feature deleted", "info");
        fetchFeatures();
      }
    } catch (e) {
      showToast("Failed to delete feature", "error");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingFeature ? `/api/ai-features/${editingFeature.id}` : "/api/ai-features";
      const method = editingFeature ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast(editingFeature ? "AI Feature updated!" : "AI Feature created!", "success");
        setModalOpen(false);
        fetchFeatures();
      }
    } catch (e) {
      showToast("Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = features.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search AI features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-galaxy-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-lg shadow-indigo-950/50"
        >
          <Plus className="w-4 h-4" /> Add AI Feature
        </button>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto mb-2" />
            Loading AI features...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">No AI features match your query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-galaxy-950/80 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Feature Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Badge</th>
                  <th className="p-4">Demo Tab</th>
                  <th className="p-4">Description Snippet</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((feat) => (
                  <tr key={feat.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6 font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-galaxy-cyan" />
                      <span>{feat.name}</span>
                    </td>
                    <td className="p-4 text-indigo-300">{feat.category}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-gray-300 border border-slate-700">
                        {feat.badge || "NPU Ready"}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-cyan-300">{feat.demoTab}</td>
                    <td className="p-4 text-gray-400 line-clamp-1 max-w-xs">{feat.shortDesc}</td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(feat)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(feat.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl bg-galaxy-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-4 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingFeature ? "Edit AI Capability" : "Create New AI Capability"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-gray-300">Feature Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Generative Video Remaster"
                  className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Productivity">Productivity</option>
                    <option value="Creativity">Creativity</option>
                    <option value="Communication">Communication</option>
                    <option value="Search & Vision">Search & Vision</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Demo Studio Tab</label>
                  <select
                    value={form.demoTab}
                    onChange={(e) => setForm({ ...form, demoTab: e.target.value })}
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="photo">photo</option>
                    <option value="translation">translation</option>
                    <option value="writing">writing</option>
                    <option value="notes">notes</option>
                    <option value="search">search</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Badge</label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="On-Device NPU"
                  className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Short Summary</label>
                <textarea
                  rows={2}
                  required
                  value={form.shortDesc}
                  onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                  placeholder="Brief 1-2 sentence description..."
                  className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Full Description</label>
                <textarea
                  rows={3}
                  value={form.fullDesc}
                  onChange={(e) => setForm({ ...form, fullDesc: e.target.value })}
                  placeholder="Detailed architecture & benefits..."
                  className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
                >
                  {saving ? "Saving..." : "Save AI Feature"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
