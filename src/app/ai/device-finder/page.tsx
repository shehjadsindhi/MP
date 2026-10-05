"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Smartphone,
  Camera,
  Briefcase,
  GraduationCap,
  Gamepad2,
  Compass,
  ArrowRight,
  RotateCcw,
  Check,
  CheckCircle2,
  Star,
  ShoppingBag,
  Sliders,
  DollarSign,
  Loader2,
  Layers,
  ShieldCheck
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

const PURPOSES = [
  { id: "Professional", label: "Executive & Productivity", icon: Briefcase, desc: "Multitasking, document signing, DeX & Knox security" },
  { id: "Camera", label: "Photography & Creator", icon: Camera, desc: "200MP zoom, RAW photography & Generative Edit" },
  { id: "Gaming", label: "High-FPS Gaming", icon: Gamepad2, desc: "Vapor chamber cooling & ray tracing graphics" },
  { id: "Student", label: "Student & Academics", icon: GraduationCap, desc: "S-Pen lecture notes, PDF summaries & discount eligibility" },
  { id: "Traveler", label: "Travel & Mobility", icon: Compass, desc: "Live voice translation, rugged build & all-day battery" },
];

const BUDGET_TIERS = [
  { label: "Any Budget", value: undefined },
  { label: "Under $400", value: 400 },
  { label: "Under $800", value: 800 },
  { label: "Under $1,200", value: 1200 },
  { label: "Flagship ($1,200+)", value: 2000 },
];

const CATEGORIES = ["All", "Smartphones", "Tablets", "Watches", "Audio"];

const FEATURE_TAGS = [
  "S-Pen Stylus",
  "200MP Camera",
  "Knox Vault",
  "Titanium Frame",
  "AMOLED 120Hz",
  "Live Translate",
  "Fast Charging",
  "Foldable Display",
];

export default function DeviceFinderPage() {
  const [purpose, setPurpose] = useState<string>("Professional");
  const [budget, setBudget] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<string>("All");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["Knox Vault"]);
  const [customQuery, setCustomQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleToggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const handleFindDevices = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/ai/device-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose,
          budget,
          category: category === "All" ? undefined : category,
          features: selectedFeatures,
          query: customQuery.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.products || []);
        showToast(`Found ${data.products?.length || 0} matching devices!`, "ai");
      } else {
        const err = await res.json();
        showToast(err.error || "Device finder error", "error");
      }
    } catch (e) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPurpose("Professional");
    setBudget(undefined);
    setCategory("All");
    setSelectedFeatures(["Knox Vault"]);
    setCustomQuery("");
    setRecommendations([]);
    setSearched(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-galaxy-cyan text-xs font-bold uppercase tracking-wider shadow-galaxy-cyan backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Neural Match Engine
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          AI Device Finder
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Tell us your workflow, preferred budget, and essential specs. Our neural matcher scans our real catalog and justifies why each device suits your lifestyle.
        </p>
      </div>

      {/* Questionnaire Wizard Card */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-10 space-y-8 shadow-2xl backdrop-blur-xl">
        {/* Step 1: Purpose */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
            1. Primary Usage Workflow
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PURPOSES.map((p) => {
              const Icon = p.icon;
              const isSelected = purpose === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPurpose(p.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "bg-cyan-500/10 border-cyan-400 text-galaxy-cyan shadow-galaxy-cyan scale-[1.02]"
                      : "bg-galaxy-950 border-slate-800 text-gray-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-2" />
                  <div className="text-xs font-bold text-white block">{p.label}</div>
                  <div className="text-[10px] text-gray-500 line-clamp-2 mt-1">{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Budget & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              2. Target Budget
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUDGET_TIERS.map((tier, idx) => (
                <button
                  key={idx}
                  onClick={() => setBudget(tier.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    budget === tier.value
                      ? "bg-slate-800 border-cyan-500/50 text-galaxy-cyan font-bold"
                      : "bg-galaxy-950 border-slate-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              3. Device Category
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all ${
                    category === cat
                      ? "bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold"
                      : "bg-galaxy-950 border-slate-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Essential Features */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
            4. Important Hardware & AI Features
          </label>
          <div className="flex flex-wrap gap-2">
            {FEATURE_TAGS.map((feat) => {
              const active = selectedFeatures.includes(feat);
              return (
                <button
                  key={feat}
                  onClick={() => handleToggleFeature(feat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    active
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold"
                      : "bg-galaxy-950 border-slate-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 text-galaxy-cyan" />}
                  {feat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Freeform Prompt input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
            5. Additional Requirements (Optional)
          </label>
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="e.g., Must have long battery life for international flights and work well with S-Pen..."
            className="w-full px-4 py-3 rounded-2xl bg-galaxy-950 border border-slate-800 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Selections
          </button>
          <button
            onClick={handleFindDevices}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-600 text-galaxy-950 font-extrabold text-xs sm:text-sm hover:opacity-95 shadow-galaxy-cyan transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Scanning Catalog...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Recommend Matching Devices
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recommendations Results Section */}
      {searched && (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Recommended For Your Workflow</h2>
              <p className="text-xs text-gray-400 mt-1">
                Ranked by compatibility with your chosen purpose, budget, and feature criteria.
              </p>
            </div>
            <span className="text-xs text-gray-400">
              Showing <strong className="text-white">{recommendations.length}</strong> verified devices
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400 space-y-3">
              <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin mx-auto" />
              <p className="text-xs">Computing multidimensional compatibility scores...</p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-20 bg-galaxy-900/40 rounded-3xl border border-slate-800 space-y-4">
              <Smartphone className="w-12 h-12 text-gray-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No devices matched all criteria</h3>
              <p className="text-xs text-gray-400">Try broadening your budget or selecting &quot;All&quot; categories.</p>
              <button
                onClick={handleReset}
                className="px-5 py-2 rounded-xl bg-galaxy-cyan text-galaxy-950 font-bold text-xs"
              >
                Reset & Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((product) => {
                const reasons: string[] = product.reasons || [];
                const matchScore: number = product.matchScore || 80;

                return (
                  <div
                    key={product.id}
                    className="rounded-3xl bg-galaxy-900/80 border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between space-y-5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-950/20 group"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-galaxy-cyan text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-galaxy-cyan">
                          <Sparkles className="w-3 h-3" /> {matchScore}% Match
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="text-white font-bold">{product.rating?.toFixed(1) || "4.8"}</span>
                        </div>
                      </div>

                      {/* Product Image */}
                      <div className="h-44 w-full bg-galaxy-950/60 rounded-2xl p-4 flex items-center justify-center overflow-hidden">
                        <img
                          src={product.image || "/images/nova_ultra.jpg"}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Title & Category */}
                      <div>
                        <span className="text-[10px] font-bold text-galaxy-cyan uppercase tracking-wider block">
                          {product.category}
                        </span>
                        <h3 className="text-lg font-bold text-white group-hover:text-galaxy-cyan transition-colors mt-0.5">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Why Selected Justification Box */}
                      {reasons.length > 0 && (
                        <div className="p-3 rounded-xl bg-galaxy-950 border border-slate-800/80 space-y-1.5">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                            Why it matches your profile:
                          </span>
                          {reasons.slice(0, 3).map((r, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-galaxy-cyan flex-shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-4 border-t border-slate-800/80 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-2xl font-extrabold text-white">
                            {formatPrice(product.price)}
                          </div>
                          {product.originalPrice > product.price && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-emerald-400 font-semibold">In Stock</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/devices/${product.slug || product.id}`}
                          className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center border border-slate-700 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => {
                            addItem({
                              productId: product.id,
                              name: product.name,
                              slug: product.slug,
                              price: product.price,
                              originalPrice: product.originalPrice,
                              image: product.image,
                              quantity: 1,
                            });
                          }}
                          className="py-2.5 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-galaxy-cyan"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
