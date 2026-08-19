"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Smartphone, Search, Check, X, Loader2, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    category: "Smartphones",
    price: "",
    originalPrice: "",
    discount: "0",
    stock: "50",
    badge: "",
    description: "",
    image: "/images/nova_ultra.jpg",
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      category: "Smartphones",
      price: "",
      originalPrice: "",
      discount: "0",
      stock: "50",
      badge: "New Flagship",
      description: "",
      image: "/images/nova_ultra.jpg",
    });
    setModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : p.price.toString(),
      discount: p.discount ? p.discount.toString() : "0",
      stock: p.stock ? p.stock.toString() : "50",
      badge: p.badge || "",
      description: p.description || "",
      image: p.image || "/images/nova_ultra.jpg",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Galaxy product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Product deleted successfully", "info");
        fetchProducts();
      }
    } catch (e) {
      showToast("Failed to delete product", "error");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast(editingProduct ? "Product updated!" : "Product created!", "success");
        setModalOpen(false);
        fetchProducts();
      } else {
        const data = await res.json();
        showToast(data.error || "Operation failed", "error");
      }
    } catch (e: any) {
      showToast("Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-galaxy-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 self-start sm:self-auto shadow-lg shadow-indigo-950/50"
        >
          <Plus className="w-4 h-4" /> Add Galaxy Product
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto mb-2" />
            Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">No products match your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-galaxy-950/80 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Device</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-galaxy-950 p-1 flex items-center justify-center border border-slate-800 flex-shrink-0">
                        <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{prod.name}</span>
                        {prod.badge && (
                          <span className="text-[10px] text-galaxy-cyan">{prod.badge}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{prod.category}</td>
                    <td className="p-4 font-mono font-bold text-white">{formatPrice(prod.price)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.stock > 10 ? "bg-emerald-950 text-emerald-300" : "bg-rose-950 text-rose-300"
                        }`}
                      >
                        {prod.stock} in stock
                      </span>
                    </td>
                    <td className="p-4 text-amber-400 font-semibold">{prod.rating.toFixed(1)} ★</td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition-colors"
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

      {/* Modal Dialog for Add / Edit Product */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-xl rounded-3xl bg-galaxy-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 z-10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingProduct ? "Edit Galaxy Product" : "Create New Galaxy Product"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-gray-300">Product Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Galaxy S25 Ultra"
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Smartphones">Smartphones</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Watches">Watches</option>
                    <option value="Audio">Audio</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="1299.99"
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Original Price (MSRP)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    placeholder="1419.99"
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Inventory Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="50"
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-gray-300">Badge Label (Optional)</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="Flagship AI Titan"
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-gray-300">Image Asset Path</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="/images/nova_ultra.jpg"
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-gray-300">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe product highlights and NPU performance..."
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
