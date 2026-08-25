"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Sparkles, Smartphone, ArrowRight, HelpCircle, Loader2, MousePointerClick } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

const PRESET_QUERIES = [
  "What Galaxy phone is best for concert photography?",
  "Which device is ideal for college students and note taking?",
  "How does Knox Vault protect on-device AI translations?",
];

const INTERACTIVE_HOTSPOTS = [
  { id: "camera", label: "200MP Camera Lens", query: "What Galaxy phone has the best 200MP camera and zoom?", x: 18, y: 15, w: 28, h: 32 },
  { id: "spen", label: "S-Pen & Note Assist", query: "Which device is ideal for college students and note taking?", x: 62, y: 35, w: 25, h: 45 },
  { id: "titanium", label: "Titanium Frame & Knox", query: "How does Knox Vault protect on-device AI translations?", x: 10, y: 55, w: 35, h: 30 },
];

export default function AIDemoSearch() {
  const [query, setQuery] = useState(PRESET_QUERIES[0]);
  const [loading, setLoading] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>("camera");
  const [result, setResult] = useState<any>({
    query: PRESET_QUERIES[0],
    aiOverview:
      "The **Galaxy S25 Ultra** is rated as the premier flagship for concert and low-light photography. It features a 200MP wide sensor, 5x periscope optical zoom with up to 100x Space Zoom, and **Generative Edit** to erase stage reflections and photobombers.",
    keyInsights: [
      "200MP Quad-Telephoto Camera System with 5x Optical Periscope zoom.",
      "Nightography Video 2.0 with dedicated AI noise reduction ISP.",
      "Generative Edit enables moving subjects and erasing reflections in seconds.",
      "S-Pen acts as a remote wireless camera shutter button.",
    ],
    matchedDevices: [
      { name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", price: 1299.99, reason: "Ultimate 200MP quad-camera & Generative Edit studio." },
      { name: "Galaxy Z Fold 6", slug: "galaxy-z-fold-6", price: 1899.99, reason: "Dual-screen FlexCam with hands-free tripod mode." },
    ],
    relatedQuestions: [
      "How does Generative Edit compare to Photoshop?",
      "What is the maximum optical zoom on Galaxy S25 Ultra?",
      "Can Galaxy AI remove glass reflections from museum photos?",
    ],
    sources: [
      { title: "Galaxy AI Photography Benchmark 2025", url: "/learn/generative-edit-photo-masterclass", domain: "galaxyai.hub" },
      { title: "Quantum NPU Camera Architecture", url: "/learn/on-device-vs-cloud-ai-privacy-deep-dive", domain: "galaxyai.hub" },
    ],
  });

  const { showToast } = useToast();

  const handleSearch = async (queryToUse?: string) => {
    const q = queryToUse || query;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        showToast("Circle to Search AI Overview generated!", "ai");
      }
    } catch (e) {
      showToast("Search error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCircleSelect = (spot: typeof INTERACTIVE_HOTSPOTS[0]) => {
    setSelectedHotspot(spot.id);
    setQuery(spot.query);
    handleSearch(spot.query);
  };

  return (
    <div className="space-y-8">
      {/* Notice */}
      <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 text-cyan-300">
          <Search className="w-4 h-4 text-galaxy-cyan flex-shrink-0" />
          <span>
            <strong>Circle to Search Demo:</strong> Tap any highlighted element below to simulate drawing an S-Pen or finger circle on screen!
          </span>
        </div>
        <span className="bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold border border-cyan-400/30">
          Google AI Powered
        </span>
      </div>

      {/* Interactive Marquee Circle Viewport Simulator */}
      <div className="rounded-3xl bg-galaxy-900 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider text-galaxy-cyan flex items-center gap-2">
            <MousePointerClick className="w-4 h-4" /> Interactive Marquee Circle Viewport
          </h4>
          <span className="text-[11px] text-gray-400">Click any element below to Circle & Search</span>
        </div>

        {/* Viewport Frame */}
        <div className="relative rounded-2xl bg-galaxy-950 border border-cyan-500/30 overflow-hidden h-[300px] flex items-center justify-center select-none group">
          {/* Background simulated device showcase image */}
          <img
            src="/images/nova_ultra.jpg"
            alt="Galaxy Device Viewport"
            className="h-full object-contain filter contrast-105"
          />

          {/* Marquee Hotspots */}
          {INTERACTIVE_HOTSPOTS.map((spot) => {
            const isSelected = selectedHotspot === spot.id;
            return (
              <div
                key={spot.id}
                onClick={() => handleCircleSelect(spot)}
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  width: `${spot.w}%`,
                  height: `${spot.h}%`,
                }}
                className={`absolute rounded-full border-2 cursor-pointer transition-all duration-300 flex items-center justify-center ${
                  isSelected
                    ? "border-galaxy-cyan bg-cyan-500/30 shadow-galaxy-cyan ring-4 ring-cyan-400/30 scale-110"
                    : "border-cyan-400/50 bg-cyan-950/30 hover:border-galaxy-cyan hover:bg-cyan-500/20"
                }`}
              >
                {/* Glowing Circle Gesture Pulse */}
                <div className="absolute inset-0 rounded-full border-2 border-galaxy-cyan animate-ping opacity-40 pointer-events-none" />
                <span className="bg-black/90 text-galaxy-cyan px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-md border border-cyan-500/40">
                  {spot.label}
                </span>
              </div>
            );
          })}

          {loading && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin" />
              <span className="text-xs font-bold text-white">Circle to Search analyzing gesture selection...</span>
            </div>
          )}
        </div>
      </div>

      {/* Query Bar */}
      <div className="rounded-2xl bg-galaxy-900 border border-slate-800 p-4 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center gap-2 bg-galaxy-950 border border-slate-700 rounded-xl px-4 py-2"
        >
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any search query or question..."
            className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 flex-shrink-0"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Search</span>
          </button>
        </form>

        {/* Preset Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-gray-400 font-medium text-[11px]">Presets:</span>
          {PRESET_QUERIES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(p);
                handleSearch(p);
              }}
              className="px-3 py-1 rounded-lg bg-galaxy-950 hover:bg-slate-800 border border-slate-800 text-gray-300 whitespace-nowrap text-[11px] transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* AI Overview Presentation */}
      {result && (
        <div className="space-y-6">
          {/* Main AI Overview Card */}
          <div className="rounded-3xl bg-galaxy-900/90 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-galaxy-cyan">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Google AI Overview</h4>
                  <span className="text-[10px] text-gray-400">Generated for &ldquo;{result.query}&rdquo;</span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
                Verified Benchmark
              </span>
            </div>

            {/* Overview Text */}
            <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
              {result.aiOverview}
            </div>

            {/* Key Insights Bullets */}
            {result.keyInsights && (
              <div className="space-y-2 pt-2">
                <h5 className="text-xs font-bold text-galaxy-cyan uppercase tracking-wider">
                  Key Takeaways
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {result.keyInsights.map((insight: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-galaxy-950/60 border border-slate-800 text-xs text-gray-300">
                      <span className="text-galaxy-cyan font-bold">•</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Devices */}
            {result.matchedDevices && result.matchedDevices.length > 0 && (
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" /> Matched Hardware Recommendation
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.matchedDevices.map((dev: any, i: number) => (
                    <Link
                      key={i}
                      href={`/devices/${dev.slug}`}
                      className="p-4 rounded-xl bg-galaxy-950 border border-indigo-500/20 hover:border-indigo-500/50 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                          {dev.name}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{dev.reason}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <div className="font-bold text-sm text-galaxy-cyan">
                          {formatPrice(dev.price)}
                        </div>
                        <span className="text-[10px] text-gray-500 group-hover:text-white flex items-center gap-1 justify-end mt-1">
                          View <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Questions */}
            {result.relatedQuestions && (
              <div className="pt-2 border-t border-slate-800">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-gray-500" /> People Also Ask
                </h5>
                <div className="flex flex-wrap gap-2">
                  {result.relatedQuestions.map((q: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(q);
                        handleSearch(q);
                      }}
                      className="text-xs text-gray-300 hover:text-galaxy-cyan bg-galaxy-950 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
