"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Sparkles, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

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
  colorsJson?: string;
  storageJson?: string;
  specsJson?: string;
  aiFeaturesJson?: string;
  stock: number;
}

export default function ProductCard({ product }: { product: ProductType }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);

  let colors: { name: string; hex: string }[] = [];
  try {
    if (product.colorsJson) colors = JSON.parse(product.colorsJson);
  } catch (e) {}

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
      selectedColor: colors.length > 0 ? colors[0].name : undefined,
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

  return (
    <div className="group relative rounded-2xl bg-galaxy-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-950/30 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Badges & Wishlist */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {product.badge ? (
          <span className="pointer-events-auto px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-galaxy-cyan font-bold text-[10px] uppercase tracking-wider backdrop-blur-md">
            {product.badge}
          </span>
        ) : product.discount > 0 ? (
          <span className="pointer-events-auto px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 font-bold text-[10px]">
            {product.discount}% OFF
          </span>
        ) : <div />}

        <button
          onClick={handleToggleWish}
          className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md transition-all ${
            isLiked
              ? "bg-rose-500/20 border border-rose-500/40 text-rose-400"
              : "bg-galaxy-950/60 border border-slate-700/60 text-gray-400 hover:text-white hover:border-slate-500"
          }`}
          title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      {/* Image Container */}
      <Link
        href={`/devices/${product.slug}`}
        className="relative h-60 w-full p-6 flex items-center justify-center bg-gradient-to-b from-galaxy-850/40 to-transparent overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain filter drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span className="text-galaxy-cyan font-medium">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-gray-500 text-[11px]">({product.reviewCount})</span>
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

          {/* Color Swatches */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-[10px] text-gray-500 mr-1">Colors:</span>
              {colors.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-slate-700 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
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
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/40 text-gray-200 hover:text-galaxy-cyan transition-all"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <Link
              href={`/devices/${product.slug}`}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm"
            >
              Buy <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
