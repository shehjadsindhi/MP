"use client";

import React from "react";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, itemCount, removeFromWishlist, moveToCart } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white">Your Saved Wishlist</h1>
        <p className="text-xs text-gray-400 mt-1">
          You have <strong className="text-rose-400">{itemCount}</strong> devices saved.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-galaxy-900/40 rounded-3xl border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-galaxy-800 flex items-center justify-center text-gray-500 mx-auto">
            <Heart className="w-8 h-8 text-rose-500/50" />
          </div>
          <h2 className="text-xl font-bold text-white">Your wishlist is empty</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Save your favorite Galaxy flagships and accessories to review them anytime.
          </p>
          <Link
            href="/devices"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Explore Devices <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-galaxy-900/70 border border-slate-800 p-6 flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="relative">
                <div className="h-44 flex items-center justify-center p-2">
                  <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-0 right-0 p-2 rounded-xl bg-galaxy-950/80 text-gray-500 hover:text-rose-400 transition-colors border border-slate-800"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-galaxy-cyan uppercase">
                  {item.category}
                </span>
                <Link href={`/devices/${item.slug}`} className="block">
                  <h3 className="text-base font-bold text-white hover:text-galaxy-cyan transition-colors line-clamp-1 mt-0.5">
                    {item.name}
                  </h3>
                </Link>
                <div className="text-lg font-extrabold text-white mt-1">
                  {formatPrice(item.price)}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => moveToCart(item)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
