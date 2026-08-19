"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    discountTotal,
    shipping,
    tax,
    total,
    promo,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    applyPromo,
    removePromo,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromo(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError("");
      setPromoInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-galaxy-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-galaxy-cyan" />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Your Galaxy Cart <span className="text-galaxy-cyan text-sm">({itemCount})</span>
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-slate-800/60">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-galaxy-800/80 border border-slate-700 flex items-center justify-center mb-4 text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Your cart is empty</h3>
                <p className="text-sm text-gray-400 max-w-xs mb-6">
                  Experience next-generation Galaxy AI flagships, tablets, and wearables.
                </p>
                <Link
                  href="/devices"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Explore Devices <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 flex gap-4">
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl bg-galaxy-800/90 border border-slate-700/60 flex-shrink-0 overflow-hidden p-1.5 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/devices/${item.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-sm font-semibold text-white hover:text-galaxy-cyan transition-colors truncate"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-500 hover:text-rose-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Variant specs */}
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      {item.selectedColor && (
                        <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {item.selectedColor}
                        </span>
                      )}
                      {item.selectedStorage && (
                        <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {item.selectedStorage}
                        </span>
                      )}
                    </div>

                    {/* Price and Counter */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-white text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <div className="flex items-center border border-slate-700 rounded-lg bg-galaxy-950/60 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-galaxy-950/80 space-y-4">
              {/* Promo Code Input */}
              {promo ? (
                <div className="flex items-center justify-between bg-cyan-950/40 border border-cyan-500/30 rounded-xl px-3.5 py-2 text-xs">
                  <div className="flex items-center gap-2 text-galaxy-cyan">
                    <Tag className="w-4 h-4" />
                    <span>
                      Promo <strong>{promo.code}</strong> Applied (-{formatPrice(discountTotal)})
                    </span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-gray-400 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. GALAXYAI2025)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-galaxy-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-200">{formatPrice(subtotal)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-galaxy-cyan font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-gray-200">
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="text-gray-200">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total</span>
                  <span className="text-galaxy-cyan">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-500 text-galaxy-950 font-bold text-sm hover:opacity-95 transition-opacity shadow-galaxy-cyan flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-galaxy-900 hover:bg-slate-800 border border-slate-700 text-gray-300 font-semibold text-xs transition-colors flex items-center justify-center"
                >
                  View Full Cart Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
