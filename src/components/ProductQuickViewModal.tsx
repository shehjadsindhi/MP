"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  CheckCircle2,
  Sparkles,
  Cpu,
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw
} from "lucide-react";
import { ProductType } from "./ProductCard";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

interface ProductQuickViewModalProps {
  product: ProductType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickViewModal({
  product,
  isOpen,
  onClose,
}: ProductQuickViewModalProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("Default");
  const [selectedStorage, setSelectedStorage] = useState<{ size: string; priceOffset: number }>({
    size: "Standard",
    priceOffset: 0,
  });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image || "/images/nova_ultra.jpg");
      setQuantity(1);

      try {
        if (product.colorsJson) {
          const parsed = JSON.parse(product.colorsJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSelectedColor(parsed[0].name);
          }
        }
        if (product.storageJson) {
          const parsed = JSON.parse(product.storageJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSelectedStorage(parsed[0]);
          }
        }
      } catch (e) {
        // Fallback default
      }
    }
  }, [product]);

  if (!isOpen || !product) return null;

  let gallery: string[] = [product.image];
  let colors: { name: string; hex: string; inStock?: boolean }[] = [];
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

  const isLiked = isInWishlist(product.id);
  const livePrice = product.price + (selectedStorage?.priceOffset || 0);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: livePrice,
      originalPrice: product.originalPrice ? product.originalPrice + (selectedStorage?.priceOffset || 0) : undefined,
      image: activeImage || product.image,
      selectedColor,
      selectedStorage: selectedStorage.size,
      quantity,
    });
    showToast(`${product.name} added to cart!`, "success");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onClose();
    router.push("/checkout");
  };

  const handleToggleWish = () => {
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

  const ratingVal = typeof product.rating === "number" && !isNaN(product.rating) ? product.rating : 4.8;
  const reviewCountVal = typeof product.reviewCount === "number" && product.reviewCount > 0 ? product.reviewCount : 120;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-galaxy-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-galaxy-900/80 hover:bg-slate-800 border border-slate-700/80 text-gray-400 hover:text-white transition-colors"
          aria-label="Close detail modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {/* Left Column: Gallery & Image Preview */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative h-64 sm:h-80 rounded-2xl bg-gradient-to-b from-galaxy-900 to-galaxy-950 border border-slate-800/80 p-6 flex items-center justify-center overflow-hidden">
              {product.badge && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-galaxy-cyan font-bold text-[11px] uppercase tracking-wider backdrop-blur-md z-10">
                  {product.badge}
                </span>
              )}
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Gallery Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-16 h-16 rounded-xl p-1.5 bg-galaxy-900 border transition-all flex-shrink-0 flex items-center justify-center ${
                      activeImage === imgUrl ? "border-galaxy-cyan shadow-galaxy-cyan" : "border-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Specs Highlight Box */}
            {Object.keys(specs).length > 0 && (
              <div className="p-4 rounded-xl bg-galaxy-900/60 border border-slate-800/80 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5 mb-2">
                  <Cpu className="w-4 h-4 text-galaxy-cyan" /> Key Specifications:
                </div>
                <div className="space-y-1.5 text-gray-300">
                  {Object.entries(specs).slice(0, 4).map(([key, val], idx) => (
                    <div key={idx} className="flex justify-between border-b border-slate-800/60 pb-1">
                      <span className="text-gray-400 font-medium">{key}:</span>
                      <span className="text-white text-right font-semibold truncate max-w-[180px]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Product Detail & Actions */}
          <div className="md:col-span-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-galaxy-cyan font-semibold uppercase tracking-wider mb-1">
                  <span>{product.category}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-white text-xs">{ratingVal.toFixed(1)}</span>
                    <span className="text-gray-400 text-[11px]">({reviewCountVal})</span>
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {product.name}
                </h2>

                <p className="text-xs text-gray-300 mt-2 leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              </div>

              {/* Price Box */}
              <div className="p-3.5 rounded-xl bg-galaxy-900/80 border border-slate-800 flex items-baseline justify-between">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-extrabold text-white">
                    {formatPrice(livePrice)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(product.originalPrice + (selectedStorage?.priceOffset || 0))}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Ship
                </div>
              </div>

              {/* Color Options */}
              {colors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-semibold">Color:</span>
                    <strong className="text-white">{selectedColor}</strong>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all ${
                          selectedColor === c.name
                            ? "border-galaxy-cyan bg-cyan-950/40 text-cyan-200 shadow-galaxy-cyan font-bold"
                            : "border-slate-800 hover:border-slate-700 bg-galaxy-900 text-gray-300"
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-slate-700" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage Options */}
              {storageOptions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-semibold">Storage:</span>
                    <strong className="text-white">{selectedStorage?.size}</strong>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {storageOptions.map((s, idx) => {
                      const isSelected = selectedStorage.size === s.size;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedStorage(s)}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "border-galaxy-cyan bg-cyan-950/40 text-white shadow-galaxy-cyan font-bold"
                              : "border-slate-800 hover:border-slate-700 bg-galaxy-900 text-gray-300"
                          }`}
                        >
                          <div className="text-xs">{s.size}</div>
                          <div className="text-[10px] text-gray-400">
                            {s.priceOffset === 0 ? "Standard" : `+${formatPrice(s.priceOffset)}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Features Tags */}
              {aiFeatures.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-galaxy-cyan" /> Integrated AI Suite:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {aiFeatures.slice(0, 4).map((feat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-[10px] capitalize font-medium"
                      >
                        {feat.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions & Buttons */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-700 rounded-xl bg-galaxy-900 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Wishlist */}
                <button
                  onClick={handleToggleWish}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isLiked
                      ? "bg-rose-500/20 border-rose-500/50 text-rose-400"
                      : "bg-galaxy-900 border-slate-700 text-gray-400 hover:text-white"
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-galaxy-cyan" /> Add to Cart
                </button>
              </div>

              {/* Buy Now & Full Details Link */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleBuyNow}
                  className="py-2.5 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-extrabold text-xs hover:opacity-95 shadow-galaxy-cyan transition-opacity text-center"
                >
                  Buy Now
                </button>

                <Link
                  href={`/devices/${product.slug}`}
                  onClick={onClose}
                  className="py-2.5 rounded-xl bg-galaxy-900 hover:bg-slate-800 border border-slate-700 text-gray-200 hover:text-white font-semibold text-xs text-center transition-colors flex items-center justify-center gap-1"
                >
                  Full Specs Page <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
