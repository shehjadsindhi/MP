import React from "react";
import Link from "next/link";
import { Smartphone } from "lucide-react";
import { safeGetProducts } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import DeviceSortSelect from "@/components/DeviceSortSelect";

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

  const categories = ["All", "Smartphones", "Tablets", "Watches", "Audio", "Accessories"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
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
