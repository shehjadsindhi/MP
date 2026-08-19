"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Check, X, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function CompareClient({ allProducts }: { allProducts: any[] }) {
  const { addItem } = useCart();

  // Initial selection of 3 top flagships
  const [selectedIds, setSelectedIds] = useState<string[]>([
    allProducts.find((p) => p.slug === "galaxy-s25-ultra")?.id || allProducts[0]?.id,
    allProducts.find((p) => p.slug === "galaxy-z-fold-6")?.id || allProducts[1]?.id,
    allProducts.find((p) => p.slug === "galaxy-tab-s10-ultra")?.id || allProducts[2]?.id,
  ].filter(Boolean));

  const selectedProducts = selectedIds.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);

  const handleDeviceChange = (slotIndex: number, newId: string) => {
    const updated = [...selectedIds];
    updated[slotIndex] = newId;
    setSelectedIds(updated);
  };

  const handleRemoveDevice = (slotIndex: number) => {
    setSelectedIds(selectedIds.filter((_, i) => i !== slotIndex));
  };

  const handleAddDeviceSlot = () => {
    if (selectedIds.length >= 3) return;
    const remaining = allProducts.find((p) => !selectedIds.includes(p.id));
    if (remaining) setSelectedIds([...selectedIds, remaining.id]);
  };

  const specCategories = [
    { label: "Category & Tier", getter: (p: any) => p.category },
    { label: "Price", getter: (p: any) => formatPrice(p.price) },
    {
      label: "Display",
      getter: (p: any) => {
        try {
          const s = JSON.parse(p.specsJson || "{}");
          return s["Display"] || s["Main Display"] || "Dynamic AMOLED 2X";
        } catch (e) {
          return "Dynamic AMOLED 2X";
        }
      },
    },
    {
      label: "Processor & NPU",
      getter: (p: any) => {
        try {
          const s = JSON.parse(p.specsJson || "{}");
          return `${s["Processor"] || "Snapdragon 8 Elite"} (${s["NPU"] || "Quantum NPU"})`;
        } catch (e) {
          return "Quantum NPU";
        }
      },
    },
    {
      label: "Camera System",
      getter: (p: any) => {
        try {
          const s = JSON.parse(p.specsJson || "{}");
          return s["Main Camera"] || s["Speaker"] || "Ultra HD Camera";
        } catch (e) {
          return "Pro Camera";
        }
      },
    },
    {
      label: "Battery & Charging",
      getter: (p: any) => {
        try {
          const s = JSON.parse(p.specsJson || "{}");
          return s["Battery"] || "5,000 mAh All-Day";
        } catch (e) {
          return "All-day Battery";
        }
      },
    },
    {
      label: "AI Features Included",
      getter: (p: any) => {
        try {
          const feats = JSON.parse(p.aiFeaturesJson || "[]");
          return feats.map((f: string) => f.replace(/-/g, " ")).join(", ") || "Full Suite";
        } catch (e) {
          return "Galaxy AI";
        }
      },
    },
    {
      label: "Knox Hardware Security",
      getter: (p: any) => {
        try {
          const s = JSON.parse(p.specsJson || "{}");
          return s["Security"] || "Knox Vault EAL5+ Enclave";
        } catch (e) {
          return "Knox Vault";
        }
      },
    },
    {
      label: "OS Updates Policy",
      getter: (p: any) => {
        try {
          const s = JSON.parse(p.specsJson || "{}");
          return s["OS Updates"] || "7 Years OS & Security Upgrades";
        } catch (e) {
          return "7 Years";
        }
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider shadow-galaxy-cyan">
          <Sparkles className="w-3.5 h-3.5" /> Hardware Comparison Lab
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Compare Galaxy Flagships
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Evaluate display specs, NPU performance, camera capabilities, and battery life side-by-side.
        </p>
      </div>

      {/* Comparison Grid Table */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Top Device Selector Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800 border-b border-slate-800 bg-galaxy-950/90">
          {/* Label Column Header */}
          <div className="p-6 hidden md:flex flex-col justify-end">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Selected Models
            </span>
            <span className="text-xs text-gray-500 mt-1">Up to 3 devices side-by-side</span>
          </div>

          {/* Device Columns (1 to 3) */}
          {selectedProducts.map((prod, idx) => (
            <div key={prod.id} className="p-6 flex flex-col justify-between space-y-4 relative">
              {selectedProducts.length > 1 && (
                <button
                  onClick={() => handleRemoveDevice(idx)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Remove column"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Selector dropdown */}
              <select
                value={prod.id}
                onChange={(e) => handleDeviceChange(idx, e.target.value)}
                className="bg-galaxy-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-galaxy-cyan"
              >
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {/* Image Preview */}
              <div className="h-44 w-full flex items-center justify-center p-2">
                <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
              </div>

              {/* Name & Pricing */}
              <div className="text-center space-y-1">
                <h3 className="font-bold text-white text-base line-clamp-1">{prod.name}</h3>
                <div className="text-lg font-extrabold text-galaxy-cyan">
                  {formatPrice(prod.price)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    addItem({
                      productId: prod.id,
                      name: prod.name,
                      slug: prod.slug,
                      price: prod.price,
                      image: prod.image,
                      quantity: 1,
                    })
                  }
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-galaxy-cyan" /> Add
                </button>
                <Link
                  href={`/devices/${prod.slug}`}
                  className="px-3 py-2 rounded-xl bg-galaxy-cyan text-galaxy-950 font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center justify-center"
                >
                  View
                </Link>
              </div>
            </div>
          ))}

          {/* Add Slot Button if < 3 */}
          {selectedProducts.length < 3 && (
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-3 bg-galaxy-950/40">
              <button
                onClick={handleAddDeviceSlot}
                className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/40 text-galaxy-cyan flex items-center justify-center transition-all shadow-lg"
              >
                <Plus className="w-6 h-6" />
              </button>
              <div className="text-xs font-bold text-white">Add Device to Compare</div>
              <div className="text-[11px] text-gray-500">Select any Galaxy model</div>
            </div>
          )}
        </div>

        {/* Spec Rows */}
        <div className="divide-y divide-slate-800">
          {specCategories.map((spec, sIdx) => (
            <div
              key={sIdx}
              className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800/80 hover:bg-slate-800/20 transition-colors"
            >
              {/* Row Label */}
              <div className="p-4 md:p-5 bg-galaxy-950/60 flex items-center">
                <span className="text-xs font-bold text-gray-300">{spec.label}</span>
              </div>

              {/* Values per column */}
              {selectedProducts.map((prod) => (
                <div key={prod.id} className="p-4 md:p-5 flex items-center text-xs text-gray-200">
                  <span>{spec.getter(prod)}</span>
                </div>
              ))}

              {/* Empty placeholder for missing slots */}
              {Array.from({ length: 3 - selectedProducts.length }).map((_, i) => (
                <div key={i} className="p-4 md:p-5 hidden md:flex items-center text-xs text-gray-600">
                  —
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
