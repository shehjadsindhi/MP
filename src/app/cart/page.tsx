"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, X, ArrowLeft, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discountTotal,
    shipping,
    tax,
    total,
    promo,
    removeItem,
    updateQuantity,
    clearCart,
    applyPromo,
    removePromo,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Your Shopping Cart</h1>
          <p className="text-xs text-gray-400 mt-1">
            You have <strong className="text-galaxy-cyan">{itemCount}</strong> items in your cart.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold self-start sm:self-auto"
          >
            Clear Entire Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-galaxy-900/40 rounded-3xl border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-galaxy-800 flex items-center justify-center text-gray-500 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Your cart is currently empty</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Explore next-generation Galaxy smartphones, tablets, and AI wearables.
          </p>
          <Link
            href="/devices"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Explore Devices <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-3xl bg-galaxy-900/60 border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 rounded-2xl bg-galaxy-950 p-2 flex items-center justify-center flex-shrink-0 border border-slate-800">
                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                    <Link
                      href={`/devices/${item.slug}`}
                      className="text-base font-bold text-white hover:text-galaxy-cyan transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-400">
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
                    <div className="text-xs text-gray-500 font-mono pt-1">
                      Unit: {formatPrice(item.price)}
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-6">
                    {/* Counter */}
                    <div className="flex items-center border border-slate-700 rounded-xl bg-galaxy-950 p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total item price */}
                    <div className="text-sm font-extrabold text-white min-w-[80px] text-right">
                      {formatPrice(item.price * item.quantity)}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs">
              <Link href="/devices" className="text-galaxy-cyan hover:underline flex items-center gap-1 font-semibold">
                <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 rounded-3xl bg-galaxy-900/90 border border-slate-800 p-6 space-y-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Order Summary
            </h2>

            {/* Promo Code Form */}
            {promo ? (
              <div className="flex items-center justify-between bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-3 text-xs">
                <div className="flex items-center gap-2 text-galaxy-cyan">
                  <Tag className="w-4 h-4" />
                  <span>
                    Code <strong>{promo.code}</strong> Applied (-{formatPrice(discountTotal)})
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
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. GALAXYAI2025)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-galaxy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-rose-400">{promoError}</p>}
              </form>
            )}

            {/* Breakdown */}
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-galaxy-cyan font-medium">
                  <span>Promotional Discount</span>
                  <span>-{formatPrice(discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-white font-medium">
                  {shipping === 0 ? "FREE (Orders over $150)" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span className="text-white font-medium">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-slate-800">
                <span>Estimated Total</span>
                <span className="text-galaxy-cyan text-xl">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <Link
              href="/checkout"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-600 text-galaxy-950 font-extrabold text-sm hover:opacity-95 shadow-galaxy-cyan transition-opacity flex items-center justify-center gap-2"
            >
              Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted Demo Payment Processing</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
