"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tag, Sparkles, Copy, Check, ArrowRight, Clock, Smartphone, Percent, DollarSign, Calculator } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function OffersClient({ offers }: { offers: any[] }) {
  const { applyPromo } = useCart();
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Trade-in Valuation Calculator State
  const [tradeBrand, setTradeBrand] = useState("Samsung");
  const [tradeModel, setTradeModel] = useState("Galaxy S23 Ultra");
  const [tradeCondition, setTradeCondition] = useState("Flawless");
  const [tradeValue, setTradeValue] = useState(550);

  const calculateTradeIn = (brand: string, model: string, condition: string) => {
    let base = 400;
    if (model.includes("Ultra") || model.includes("Fold")) base = 600;
    if (model.includes("Plus") || model.includes("Pro")) base = 450;
    if (condition === "Flawless") base += 50;
    if (condition === "Cracked Screen") base -= 150;
    setTradeValue(Math.max(100, base));
  };

  const handleCopyAndApply = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyPromo(code);
    showToast(`Code ${code} copied & applied to your cart!`, "success");
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider shadow-galaxy-cyan">
          <Tag className="w-3.5 h-3.5" /> Exclusive Galaxy AI Promotions
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Current Deals & Promotional Offers
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Save on next-generation Galaxy flagships, bundle wearable ecosystems, and unlock education discounts.
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-3xl bg-galaxy-900/80 border border-cyan-500/30 p-7 flex flex-col justify-between space-y-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/60"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-galaxy-cyan text-xs font-bold border border-cyan-500/40">
                  {offer.badge || "Special Deal"}
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Valid until {formatDate(offer.validUntil)}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white leading-snug">{offer.title}</h2>

              <p className="text-xs text-gray-300 leading-relaxed">{offer.description}</p>

              {/* Coupon Code Pill */}
              <div className="p-3.5 rounded-2xl bg-galaxy-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                    Promo Coupon Code
                  </span>
                  <span className="font-mono text-base font-extrabold text-galaxy-cyan">
                    {offer.code}
                  </span>
                </div>

                <button
                  onClick={() => handleCopyAndApply(offer.code)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Applied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy & Apply
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-gray-400">Category: {offer.eligibleCategory}</span>
              <Link
                href="/devices"
                className="font-bold text-galaxy-cyan hover:underline flex items-center gap-1"
              >
                Shop Eligible <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Trade-In Estimator Simulator */}
      <div className="rounded-3xl bg-gradient-to-r from-galaxy-900 via-galaxy-850 to-galaxy-900 border border-slate-800 p-8 sm:p-12 space-y-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-galaxy-cyan uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4" /> Instant Valuation Calculator
            </div>
            <h3 className="text-2xl font-bold text-white">Galaxy AI Trade-In Value Estimator</h3>
            <p className="text-xs text-gray-400 mt-1">
              Trade in your current smartphone and receive guaranteed instant credit towards the Galaxy S25 series.
            </p>
          </div>

          <div className="text-right p-4 rounded-2xl bg-galaxy-950 border border-cyan-500/30">
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">
              Estimated Trade-in Credit
            </span>
            <span className="text-3xl font-extrabold text-galaxy-cyan">
              Up to {formatPrice(tradeValue)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Brand */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300">Device Brand</label>
            <select
              value={tradeBrand}
              onChange={(e) => {
                setTradeBrand(e.target.value);
                calculateTradeIn(e.target.value, tradeModel, tradeCondition);
              }}
              className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-galaxy-cyan"
            >
              <option value="Samsung">Samsung</option>
              <option value="Apple">Apple</option>
              <option value="Google">Google</option>
            </select>
          </div>

          {/* Model */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300">Model</label>
            <select
              value={tradeModel}
              onChange={(e) => {
                setTradeModel(e.target.value);
                calculateTradeIn(tradeBrand, e.target.value, tradeCondition);
              }}
              className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-galaxy-cyan"
            >
              <option value="Galaxy S23 Ultra">Galaxy S23 Ultra</option>
              <option value="Galaxy S22 Ultra">Galaxy S22 Ultra</option>
              <option value="Galaxy Z Fold 5">Galaxy Z Fold 5</option>
              <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
              <option value="Pixel 8 Pro">Pixel 8 Pro</option>
            </select>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300">Cosmetic Condition</label>
            <select
              value={tradeCondition}
              onChange={(e) => {
                setTradeCondition(e.target.value);
                calculateTradeIn(tradeBrand, tradeModel, e.target.value);
              }}
              className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-galaxy-cyan"
            >
              <option value="Flawless">Flawless (No scratches)</option>
              <option value="Good">Good (Light signs of use)</option>
              <option value="Cracked Screen">Cracked Screen</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Link
            href="/devices/galaxy-s25-ultra"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            Apply {formatPrice(tradeValue)} Credit to Galaxy S25 Ultra <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
