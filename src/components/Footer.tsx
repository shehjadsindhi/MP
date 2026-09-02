"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Send, CheckCircle2, Loader2, Info } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubscribed(true);
        showToast(data.message || "Subscribed to Galaxy AI updates!", "success");
        setEmail("");
      } else {
        showToast(data.error || "Subscription failed. Please check your email.", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-galaxy-950 border-t border-slate-800 text-gray-400 text-sm mt-24">
      {/* Educational Concept Disclaimer Banner */}
      <div className="bg-gradient-to-r from-galaxy-950 via-slate-900 to-galaxy-950 border-b border-slate-800/80 py-4 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-gray-400">
          <Info className="w-3.5 h-3.5 text-galaxy-cyan flex-shrink-0" />
          <span>
            <strong>Disclaimer:</strong> Galaxy AI Hub is an unofficial educational demonstration platform inspired by Galaxy AI technology. All product names, trademarks, and brand references are the property of their respective owners.
          </span>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-galaxy-cyan to-indigo-600 p-0.5 shadow-galaxy-cyan transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-galaxy-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-galaxy-cyan" />
              </div>
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white">
              GALAXY <span className="text-galaxy-cyan">AI</span> HUB
            </span>
          </Link>
          <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
            An interactive educational showcase designed to explore, test, and understand next-generation on-device artificial intelligence across smartphones, tablets, and wearables.
          </p>

          {/* Newsletter Form */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Stay Ahead of AI Innovations
            </h3>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3.5 py-2.5 rounded-xl max-w-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Thank you for subscribing! You will receive future showcase updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-galaxy-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan transition-colors"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-galaxy-cyan hover:bg-cyan-400 text-galaxy-950 font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  aria-label="Subscribe to newsletter"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Column 1: AI Features */}
        <div>
          <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4 text-galaxy-cyan">
            Galaxy AI Tools
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/ai/features/circle-to-search" className="hover:text-white transition-colors">
                Circle to Search
              </Link>
            </li>
            <li>
              <Link href="/ai/features/live-translate" className="hover:text-white transition-colors">
                Live Translate
              </Link>
            </li>
            <li>
              <Link href="/ai/features/generative-edit" className="hover:text-white transition-colors">
                Generative Edit
              </Link>
            </li>
            <li>
              <Link href="/ai/features/writing-assist" className="hover:text-white transition-colors">
                Writing Assist
              </Link>
            </li>
            <li>
              <Link href="/ai/features/note-assist" className="hover:text-white transition-colors">
                Note Assist
              </Link>
            </li>
            <li>
              <Link href="/ai/demos" className="text-galaxy-cyan font-medium hover:underline">
                Interactive AI Simulator &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Marketplace */}
        <div>
          <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4 text-galaxy-cyan">
            Devices & Hardware
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/devices/galaxy-s25-ultra" className="hover:text-white transition-colors">
                Galaxy S25 Ultra
              </Link>
            </li>
            <li>
              <Link href="/devices/galaxy-z-fold-6" className="hover:text-white transition-colors">
                Galaxy Z Fold 6
              </Link>
            </li>
            <li>
              <Link href="/devices/galaxy-tab-s10-ultra" className="hover:text-white transition-colors">
                Galaxy Tab S10 Ultra
              </Link>
            </li>
            <li>
              <Link href="/devices/galaxy-watch-ultra" className="hover:text-white transition-colors">
                Galaxy Watch Ultra
              </Link>
            </li>
            <li>
              <Link href="/devices/galaxy-buds3-pro" className="hover:text-white transition-colors">
                Galaxy Buds3 Pro
              </Link>
            </li>
            <li>
              <Link href="/compare" className="text-galaxy-cyan font-medium hover:underline">
                Device Comparison &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Platform */}
        <div>
          <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4 text-galaxy-cyan">
            Ecosystem & Portal
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/learn" className="hover:text-white transition-colors">
                Learning Center & Guides
              </Link>
            </li>
            <li>
              <Link href="/offers" className="hover:text-white transition-colors">
                Promotions & Student Deals
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-white transition-colors">
                User Dashboard
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-white transition-colors">
                Track Orders
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-indigo-400 hover:underline flex items-center gap-1">
                Admin Management
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Galaxy AI Hub. Independent Educational Concept.</p>
          <div className="flex items-center gap-6 text-gray-500">
            <Link href="/learn/knox-vault-ai-privacy-whitepaper" className="hover:text-gray-300 transition-colors">
              Privacy Architecture
            </Link>
            <span>•</span>
            <Link href="/learn" className="hover:text-gray-300 transition-colors">
              Tutorials
            </Link>
            <span>•</span>
            <Link href="/ai/demos" className="hover:text-gray-300 transition-colors">
              AI Simulator
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
