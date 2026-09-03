import React from "react";
import Link from "next/link";
import { Smartphone, Sparkles, Cpu, ShieldCheck, Zap, ArrowRight, Star } from "lucide-react";
import { safeGetProducts } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import DeviceSortSelect from "@/components/DeviceSortSelect";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Galaxy Device Marketplace — Galaxy AI Hub",
  description: "Explore the complete flagship portfolio of Galaxy smartphones, foldables, tablets, and wearables engineered for Galaxy AI.",
};

export default async function DevicesPage({
  searchParams,
}: {
  searchParams?: { category?: string; sort?: string; search?: string; minPrice?: string; maxPrice?: string };
}) {
  const selectedCategory = searchParams?.category || "All";
  const selectedSort = searchParams?.sort || "featured";
  const searchQuery = searchParams?.search || "";
  const minPrice = searchParams?.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;

  const products = await safeGetProducts({
    category: selectedCategory,
    sort: selectedSort,
    search: searchQuery,
    minPrice,
    maxPrice,
  });

  const featuredSpotlight = products.find((p) => p.isFeatured) || products[0];

  const categories = ["All", "Smartphones", "Tablets", "Watches", "Audio", "Accessories"];

  let spotlightAiFeatures: string[] = [];
  let spotlightSpecs: Record<string, string> = {};
  if (featuredSpotlight) {
    try {
      if (featuredSpotlight.aiFeaturesJson) spotlightAiFeatures = JSON.parse(featuredSpotlight.aiFeaturesJson);
      if (featuredSpotlight.specsJson) spotlightSpecs = JSON.parse(featuredSpotlight.specsJson);
    } catch (e) {}
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider shadow-galaxy-cyan">
          <Smartphone className="w-3.5 h-3.5" /> Galaxy AI Hardware Portfolio
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Next-Gen Galaxy Devices
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Supercharged with dedicated Neural Processing Units (NPUs), Titanium craftsmanship, and Knox Vault protection.
        </p>
      </div>

      {/* Main Flagship Product Spotlight Banner */}
      {featuredSpotlight && selectedCategory === "All" && !searchQuery && (
        <div className="relative rounded-3xl bg-gradient-to-r from-galaxy-900 via-galaxy-950 to-slate-900 border border-cyan-500/30 p-6 sm:p-10 overflow-hidden shadow-2xl group">
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-galaxy-cyan text-xs font-extrabold uppercase tracking-wider">
                  {featuredSpotlight.badge || "Flagship Spotlight"}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-white font-bold">{featuredSpotlight.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({featuredSpotlight.reviewCount} reviews)</span>
                </div>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {featuredSpotlight.name}
                </h2>
                <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                  {featuredSpotlight.description}
                </p>
              </div>

              {/* Specs Pills */}
              {Object.keys(spotlightSpecs).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {Object.entries(spotlightSpecs).slice(0, 3).map(([key, val], idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-galaxy-950/80 border border-slate-800 text-xs">
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">{key}</span>
                      <span className="text-white font-bold truncate block mt-0.5">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Integrated AI Features */}
              {spotlightAiFeatures.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-galaxy-cyan" /> Galaxy AI:
                  </span>
                  {spotlightAiFeatures.slice(0, 4).map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-galaxy-cyan text-xs capitalize font-medium"
                    >
                      {feat.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              )}

              {/* Price & CTA */}
              <div className="flex items-center gap-4 pt-2">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {formatPrice(featuredSpotlight.price)}
                  </div>
                  {featuredSpotlight.originalPrice > featuredSpotlight.price && (
                    <div className="text-xs text-gray-500 line-through">
                      {formatPrice(featuredSpotlight.originalPrice)}
                    </div>
                  )}
                </div>

                <Link
                  href={`/devices/${featuredSpotlight.slug}`}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-600 text-galaxy-950 font-extrabold text-xs sm:text-sm hover:opacity-95 shadow-galaxy-cyan transition-all flex items-center gap-2"
                >
                  Explore Full Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Showcase Image */}
            <div className="lg:col-span-5 flex items-center justify-center p-4">
              <div className="relative h-64 sm:h-80 w-full flex items-center justify-center">
                <img
                  src={featuredSpotlight.image || "/images/nova_ultra.jpg"}
                  alt={featuredSpotlight.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Sort Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-galaxy-900/80 border border-slate-800 backdrop-blur-xl">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Link
                key={cat}
                href={cat === "All" ? "/devices" : `/devices?category=${cat}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 shadow-galaxy-cyan font-bold"
                    : "bg-galaxy-950 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 text-xs">
          <span className="text-gray-400">
            Showing <strong className="text-white">{products.length}</strong> devices
          </span>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 hidden sm:inline">Sort by:</span>
            <DeviceSortSelect
              selectedSort={selectedSort}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-galaxy-900/40 rounded-3xl border border-slate-800 space-y-4">
          <Smartphone className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No devices found</h3>
          <p className="text-xs text-gray-400">Try adjusting your filters or category selection.</p>
          <Link
            href="/devices"
            className="inline-block px-5 py-2 rounded-xl bg-galaxy-cyan text-galaxy-950 font-bold text-xs"
          >
            Reset Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}
    </div>
  );
}

