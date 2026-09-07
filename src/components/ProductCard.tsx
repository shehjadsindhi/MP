"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, ArrowRight, Eye, Cpu, Camera, Battery, Layers } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductQuickViewModal from "./ProductQuickViewModal";

export interface ProductType {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  badge?: string | null;
  description: string;
  image: string;
  galleryJson?: string;
  colorsJson?: string;
  storageJson?: string;
  specsJson?: string;
  aiFeaturesJson?: string;
  stock: number;
}

export default function ProductCard({ product }: { product: ProductType }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [showSpecsPopover, setShowSpecsPopover] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isLiked = isInWishlist(product.id);

  let colors: { name: string; hex: string }[] = [];
  try {
    if (product.colorsJson) colors = JSON.parse(product.colorsJson);
  } catch (e) {}

  let specs: Record<string, string> = {};
  try {
    if (product.specsJson) specs = JSON.parse(product.specsJson);
  } catch (e) {}

  // Extract a few key display specs
  const quickSpecs = [
    specs["Processor"] || specs["Chipset"] ? { label: "Chipset", value: specs["Processor"] || specs["Chipset"], Icon: Cpu } : null,
    specs["Camera"] || specs["Main Camera"] ? { label: "Camera", value: specs["Camera"] || specs["Main Camera"], Icon: Camera } : null,
    specs["Battery"] ? { label: "Battery", value: specs["Battery"], Icon: Battery } : null,
    specs["Display"] || specs["Screen"] ? { label: "Display", value: specs["Display"] || specs["Screen"], Icon: Layers } : null,
  ].filter(Boolean).slice(0, 4) as { label: string; value: string; Icon: any }[];

  const [selectedColor, setSelectedColor] = useState(colors.length > 0 ? colors[0].name : undefined);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: 1,
      selectedColor: selectedColor || (colors.length > 0 ? colors[0].name : undefined),
    });
  };

  const handleToggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const ratingVal = typeof product.rating === "number" && !isNaN(product.rating) ? product.rating : 4.8;
  const reviewCountVal = typeof product.reviewCount === "number" && product.reviewCount > 0 ? product.reviewCount : null;

  return (
    <>
      <div className="group relative rounded-3xl bg-galaxy-900/60 border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-950/40 transition-all duration-300 flex flex-col overflow-hidden glass-card">
        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          {product.badge ? (
            <span className="pointer-events-auto px-2.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-galaxy-cyan font-bold text-[10px] uppercase tracking-wider backdrop-blur-md shadow-galaxy-cyan">
              {product.badge}
            </span>
          ) : product.discount > 0 ? (
            <span className="pointer-events-auto px-2.5 py-0.5 rounded-full bg-rose-950/90 border border-rose-500/40 text-rose-400 font-bold text-[10px] shadow-sm">
              {product.discount}% OFF
            </span>
          ) : <div />}

          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              onClick={handleOpenQuickView}
              className="p-2 rounded-xl bg-galaxy-950/70 border border-slate-700/60 text-gray-400 hover:text-white hover:border-slate-500 backdrop-blur-md transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              title="Quick Detail View"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4 text-galaxy-cyan" />
            </button>
            <button
              onClick={handleToggleWish}
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
                isLiked
                  ? "bg-rose-500/20 border border-rose-500/40 text-rose-400"
                  : "bg-galaxy-950/70 border border-slate-700/60 text-gray-400 hover:text-white hover:border-slate-500"
              }`}
              title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
              aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={isLiked}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Image Container with Quick Specs Popover */}
        <Link
          href={`/devices/${product.slug}`}
          className="relative h-60 w-full p-6 flex items-center justify-center bg-gradient-to-b from-galaxy-850/40 via-galaxy-900/20 to-transparent overflow-hidden"
          onMouseEnter={() => quickSpecs.length > 0 && setShowSpecsPopover(true)}
          onMouseLeave={() => setShowSpecsPopover(false)}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-t-transparent border-galaxy-cyan rounded-full animate-spin" />
            </div>
          )}
          <img
            src={imageError ? "/images/nova_ultra.jpg" : (product.image || "/images/nova_ultra.jpg")}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            onError={() => { setImageError(true); setImageLoaded(true); }}
            className={`w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            draggable={false}
          />

          {/* Quick Specs Popover */}
          {showSpecsPopover && quickSpecs.length > 0 && (
            <div className="absolute inset-0 bg-galaxy-950/90 backdrop-blur-sm flex flex-col justify-center px-5 py-4 space-y-2 animate-in fade-in duration-200">
              <p className="text-[10px] font-extrabold text-galaxy-cyan uppercase tracking-widest mb-1 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Quick Specs
              </p>
              {quickSpecs.map((spec, idx) => {
                const Icon = spec.Icon;
                return (
                  <div key={idx} className="flex items-start gap-2 text-[11px]">
                    <Icon className="w-3.5 h-3.5 text-galaxy-cyan flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-400 font-medium">{spec.label}: </span>
                      <span className="text-white font-semibold">{spec.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span className="text-galaxy-cyan font-semibold tracking-wide uppercase text-[10px]">{product.category}</span>
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{ratingVal.toFixed(1)}</span>
                {reviewCountVal && (
                  <span className="text-gray-500 text-[11px]">({reviewCountVal})</span>
                )}
              </div>
            </div>

            {/* Product Name */}
            <Link href={`/devices/${product.slug}`} className="block">
              <h3 className="text-base font-bold text-white group-hover:text-galaxy-cyan transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            {/* Description snippet */}
            <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
              {product.description}
            </p>

            {/* Interactive Color Swatches */}
            {colors.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[10px] font-semibold text-gray-400">Color:</span>
                <div className="flex items-center gap-1.5">
                  {colors.slice(0, 4).map((c, i) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedColor(c.name);
                        }}
                        className={`w-4 h-4 rounded-full border transition-all ${
                          isSelected
                            ? "ring-2 ring-cyan-400 ring-offset-1 ring-offset-galaxy-950 scale-110 border-white"
                            : "border-slate-700 hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & CTA */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <div>
              <div className="text-lg font-extrabold text-white">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice > product.price && (
                <div className="text-xs text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCart}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/40 text-gray-200 hover:text-galaxy-cyan transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                title="Add to Cart"
                aria-label="Add to Cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
              <button
                onClick={handleOpenQuickView}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-600 text-galaxy-950 font-extrabold text-xs hover:opacity-95 transition-all flex items-center gap-1 shadow-sm shimmer-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Product Detail"
              >
                Detail <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductQuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}

