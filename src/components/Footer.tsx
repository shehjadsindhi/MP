"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Shield, Cpu, Lock, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast("Subscribed to Galaxy AI Intelligence updates!", "success");
    setEmail("");
  };

  return (
    <footer className="bg-galaxy-950 border-t border-slate-800 text-gray-400 text-sm mt-24">
      {/* Top Value Proposition Grid */}
      <div className="border-b border-slate-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-galaxy-900/40 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-galaxy-cyan flex-shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base mb-1">On-Device Quantum NPU</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Live Translate, Interpreter, and Tone Correction execute 100% locally with near-zero latency.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-2xl bg-galaxy-900/40 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base mb-1">Knox Vault Hardware Defense</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                EAL5+ certified hardware encryption isolates your biometric keys and personal notes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-2xl bg-galaxy-900/40 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base mb-1">Total Privacy Control</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Granular master toggle to restrict AI operations exclusively to on-device processing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-galaxy-cyan to-indigo-600 p-0.5 shadow-galaxy-cyan">
              <div className="w-full h-full bg-galaxy-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-galaxy-cyan" />
              </div>
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white">
              GALAXY <span className="text-galaxy-cyan">AI</span> HUB
            </span>
          </Link>
          <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
            The definitive platform for discovering, testing, and mastering next-generation on-device artificial intelligence across Galaxy smartphones, tablets, and wearables.
          </p>

          {/* Newsletter */}
          <div className="pt-2">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Stay Ahead of AI Innovations
            </h5>
            <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-galaxy-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-galaxy-cyan hover:bg-cyan-400 text-galaxy-950 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Column 1: AI Features */}
        <div>
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4 text-galaxy-cyan">
            Galaxy AI Tools
          </h5>
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
                Interactive AI Lab &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Marketplace */}
        <div>
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4 text-galaxy-cyan">
            Devices & Hardware
          </h5>
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
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4 text-galaxy-cyan">
            Ecosystem & Portal
          </h5>
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
          <p>© {new Date().getFullYear()} Galaxy AI Hub. Designed for advanced on-device intelligence.</p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500">Zero-data retention cloud AI toggle supported</span>
            <span className="text-gray-500">•</span>
            <span className="text-galaxy-cyan font-mono">Status: All AI NPUs Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
