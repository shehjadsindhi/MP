"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Edit2, Trash2, Search, X, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

export default function AdminContentPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: "",
    category: "AI Guides",
    author: "Galaxy AI Lab",
    readTime: "5 min read",
    excerpt: "",
    content: "",
    image: "/images/nova_ultra.jpg",
  });

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setForm({
      title: "",
      category: "AI Guides",
      author: "Galaxy AI Lab",
      readTime: "5 min read",
      excerpt: "",
      content: "",
      image: "/images/nova_ultra.jpg",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast("Article published successfully!", "success");
        setModalOpen(false);
        fetchArticles();
      }
    } catch (e) {
      showToast("Failed to publish article", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides and tutorials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-galaxy-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-lg shadow-indigo-950/50"
        >
          <Plus className="w-4 h-4" /> Publish Guide Article
        </button>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto mb-2" />
            Loading articles...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">No articles match your query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-galaxy-950/80 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Article Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Read Time</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6 font-bold text-white max-w-sm line-clamp-1">
                      {art.title}
                    </td>
                    <td className="p-4 text-emerald-300">{art.category}</td>
                    <td className="p-4 text-gray-300">{art.author}</td>
                    <td className="p-4 text-gray-400">{art.readTime}</td>
                    <td className="p-4 text-gray-400">{formatDate(art.createdAt)}</td>
                    <td className="p-4 pr-6 text-right">
                      <a
                        href={`/learn/${art.slug}`}
                        target="_blank"
                        className="text-xs font-bold text-indigo-400 hover:underline"
                      >
                        View Live &rarr;
                      </a>
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
          <div className="relative w-full max-w-xl rounded-3xl bg-galaxy-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-4 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Publish New Learning Article</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-gray-300">Article Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Mastering Generative Edit in 5 Steps"
                  className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="AI Guides">AI Guides</option>
                    <option value="AI Tips">AI Tips</option>
                    <option value="Device Guides">Device Guides</option>
                    <option value="Tutorials">Tutorials</option>
                    <option value="News">News</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Read Time</label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Excerpt</label>
                <textarea
                  rows={2}
                  required
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Short introductory summary..."
                  className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Full Content (Markdown format supported)</label>
                <textarea
                  rows={6}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="## Section Heading..."
                  className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 resize-none font-mono"
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
                  {saving ? "Publishing..." : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
