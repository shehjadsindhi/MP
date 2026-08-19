"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Cpu,
  CheckCircle2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Share2
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

export default function DeviceDetailClient({ product, relatedProducts }: { product: any; relatedProducts: any[] }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  let gallery: string[] = [product.image];
  let colors: { name: string; hex: string; inStock: boolean }[] = [];
  let storageOptions: { size: string; priceOffset: number }[] = [];
  let specs: Record<string, string> = {};
  let aiFeatures: string[] = [];

  try {
    if (product.galleryJson) {
      const g = JSON.parse(product.galleryJson);
      if (Array.isArray(g) && g.length > 0) gallery = g;
    }
    if (product.colorsJson) colors = JSON.parse(product.colorsJson);
    if (product.storageJson) storageOptions = JSON.parse(product.storageJson);
    if (product.specsJson) specs = JSON.parse(product.specsJson);
    if (product.aiFeaturesJson) aiFeatures = JSON.parse(product.aiFeaturesJson);
  } catch (e) {}

  const [activeImage, setActiveImage] = useState(gallery[0] || product.image);
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || "Default");
  const [selectedStorage, setSelectedStorage] = useState(storageOptions[0] || { size: "Standard", priceOffset: 0 });
  const [quantity, setQuantity] = useState(1);

  const isLiked = isInWishlist(product.id);

  // Compute live price with selected storage offset
  const livePrice = product.price + (selectedStorage?.priceOffset || 0);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: livePrice,
      originalPrice: product.originalPrice ? product.originalPrice + (selectedStorage?.priceOffset || 0) : undefined,
      image: activeImage,
      selectedColor,
      selectedStorage: selectedStorage.size,
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      badge: product.badge,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied to clipboard!", "info");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 pb-24">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Link href="/devices" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Devices
          </Link>
          <span>/</span>
          <span className="text-gray-500">{product.category}</span>
          <span>/</span>
          <span className="text-galaxy-cyan font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Active Image Viewport */}
          <div className="relative h-[380px] sm:h-[480px] rounded-3xl bg-gradient-to-b from-galaxy-900 to-galaxy-950 border border-slate-800 p-8 flex items-center justify-center shadow-2xl overflow-hidden group">
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-galaxy-cyan font-bold text-xs uppercase tracking-wider backdrop-blur-md z-10">
                {product.badge}
              </span>
            )}
            <img
              src={activeImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl p-2 bg-galaxy-900 border transition-all flex-shrink-0 flex items-center justify-center ${
                    activeImage === imgUrl ? "border-galaxy-cyan shadow-galaxy-cyan scale-105" : "border-slate-800 hover:border-slate-600"
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info & Purchasing Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-galaxy-cyan font-semibold uppercase tracking-wider mb-2">
              <span>{product.category}</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-white text-sm">{product.rating.toFixed(1)}</span>
                <span className="text-gray-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>

            <p className="text-sm text-gray-300 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-galaxy-900/80 border border-slate-800 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                {formatPrice(livePrice)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-gray-500 line-through">
                  {formatPrice(product.originalPrice + (selectedStorage?.priceOffset || 0))}
                </span>
              )}
            </div>

            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> In Stock ({product.stock} units ready)
            </div>
          </div>

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-semibold">Finish / Color:</span>
                <strong className="text-white">{selectedColor}</strong>
              </div>
              <div className="flex items-center gap-3">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                      selectedColor === c.name
                        ? "border-galaxy-cyan bg-cyan-950/40 text-cyan-200 shadow-galaxy-cyan font-bold"
                        : "border-slate-800 hover:border-slate-600 bg-galaxy-900 text-gray-300"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage Selection */}
          {storageOptions.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-semibold">Storage Capacity:</span>
                <strong className="text-white">{selectedStorage?.size}</strong>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {storageOptions.map((s, idx) => {
                  const isSelected = selectedStorage.size === s.size;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedStorage(s)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-galaxy-cyan bg-cyan-950/50 text-white shadow-galaxy-cyan font-bold"
                          : "border-slate-800 hover:border-slate-700 bg-galaxy-900 text-gray-300"
                      }`}
                    >
                      <div className="text-sm">{s.size}</div>
                      <div className="text-[11px] text-gray-400 font-normal">
                        {s.priceOffset === 0 ? "Standard Base" : `+${formatPrice(s.priceOffset)}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Counter */}
              <div className="flex items-center border border-slate-700 rounded-2xl bg-galaxy-900 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Wishlist */}
              <button
                onClick={handleToggleWishlist}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isLiked
                    ? "bg-rose-500/20 border-rose-500/50 text-rose-400"
                    : "bg-galaxy-900 border-slate-700 text-gray-400 hover:text-white hover:border-slate-500"
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4 text-galaxy-cyan" /> Add to Cart
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-600 text-galaxy-950 font-extrabold text-sm hover:opacity-95 shadow-galaxy-cyan transition-opacity flex items-center justify-center gap-2"
            >
              Buy Now with 1-Click Checkout &rarr;
            </button>
          </div>

          {/* Perks Bar */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center text-xs text-gray-400">
            <div className="p-3 rounded-xl bg-galaxy-950/60 border border-slate-800/80 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-galaxy-cyan" />
              <span>Free Express Delivery</span>
            </div>
            <div className="p-3 rounded-xl bg-galaxy-950/60 border border-slate-800/80 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>2-Year Galaxy Care</span>
            </div>
            <div className="p-3 rounded-xl bg-galaxy-950/60 border border-slate-800/80 flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>30-Day Free Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & AI Features Tabs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Hardware Specifications */}
        <div className="lg:col-span-7 rounded-3xl bg-galaxy-900/60 border border-slate-800 p-8 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-galaxy-cyan" /> Technical Specifications
          </h3>

          <div className="divide-y divide-slate-800">
            {Object.entries(specs).map(([key, val], idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:justify-between text-xs gap-1">
                <span className="font-semibold text-gray-400">{key}</span>
                <span className="text-white text-right font-medium max-w-sm">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Supported AI Features */}
        <div className="lg:col-span-5 rounded-3xl bg-galaxy-900/60 border border-cyan-500/30 p-8 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-galaxy-cyan" /> Integrated Galaxy AI Suite
          </h3>

          <div className="space-y-2.5">
            {aiFeatures.map((slug, idx) => (
              <Link
                key={idx}
                href={`/ai/features/${slug}`}
                className="flex items-center justify-between p-3 rounded-xl bg-galaxy-950 border border-slate-800 hover:border-cyan-500/40 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-cyan-950 text-galaxy-cyan flex items-center justify-center text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-white group-hover:text-galaxy-cyan capitalize">
                    {slug.replace(/-/g, " ")}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
              </Link>
            ))}

            <div className="pt-4">
              <Link
                href="/ai/demos"
                className="block w-full py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-galaxy-cyan text-xs font-bold text-center transition-colors"
              >
                Test AI Suite in Live Demo Lab &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Compare Similar Galaxy Devices</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="p-5 rounded-2xl bg-galaxy-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="h-40 flex items-center justify-center p-2">
                  <img src={rel.image} alt={rel.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{rel.name}</h4>
                  <div className="text-sm font-extrabold text-galaxy-cyan mt-1">
                    {formatPrice(rel.price)}
                  </div>
                </div>
                <Link
                  href={`/devices/${rel.slug}`}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white text-center transition-colors block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
