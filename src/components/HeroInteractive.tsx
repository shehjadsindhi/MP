"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Search,
  Languages,
  Wand2,
  FileCheck,
  Zap,
  ShieldCheck,
  Cpu,
  CheckCircle2
} from "lucide-react";

const HERO_FEATURES = [
  {
    id: "circle-to-search",
    title: "Circle to Search",
    subtitle: "Google powered visual lookup",
    icon: Search,
    color: "from-cyan-500 to-blue-600",
    badge: "Instant AI",
    previewText: "Draw any circle on your screen to identify objects, search text, or shop items instantly.",
    sampleTag: "Galaxy S25 Ultra • NPU 45 TOPS",
    img: "/images/nova_ultra.jpg"
  },
  {
    id: "live-translate",
    title: "Live Call Translate",
    subtitle: "Real-time 16+ language audio",
    icon: Languages,
    color: "from-indigo-500 to-purple-600",
    badge: "2-Way Audio",
    previewText: "Break language barriers on phone calls in real-time. Speak in English, receiver hears Korean.",
    sampleTag: "Galaxy Z Fold6 • Zero Latency",
    img: "/images/fold_zenith.jpg"
  },
  {
    id: "generative-edit",
    title: "Generative Photo Edit",
    subtitle: "Resize, remove, or fill objects",
    icon: Wand2,
    color: "from-purple-500 to-pink-600",
    badge: "Canvas Magic",
    previewText: "Remove unwanted reflections, relocate subjects, and fill missing background seamlessly.",
    sampleTag: "Galaxy Tab S10 Ultra • Pro Canvas",
    img: "/images/tab_aurora.jpg"
  },
  {
    id: "note-assist",
    title: "AI Note & Voice Assist",
    subtitle: "Auto summary & audio transcript",
    icon: FileCheck,
    color: "from-emerald-500 to-teal-600",
    badge: "Smart Summaries",
    previewText: "Transform meeting recordings into structured bullet points with speaker timestamps.",
    sampleTag: "Galaxy Watch Ultra • Bio NPU",
    img: "/images/watch_nexus.jpg"
  }
];

export default function HeroInteractive() {
  const [activeTab, setActiveTab] = useState(HERO_FEATURES[0].id);

  const currentFeature = HERO_FEATURES.find((f) => f.id === activeTab) || HERO_FEATURES[0];
  const IconComponent = currentFeature.icon;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-8 pb-16">
      {/* Background glow & radial galaxy effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute inset-0 galaxy-stars-bg opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-galaxy-900/90 border border-cyan-500/40 text-galaxy-cyan text-xs font-bold uppercase tracking-wider shadow-galaxy-cyan backdrop-blur-xl">
              <Sparkles className="w-4 h-4 animate-spin-slow text-galaxy-cyan" />
              <span>Next-Gen Galaxy AI 2.0 Ecosystem</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Galaxy AI. <br />
              <span className="gradient-text-galaxy">Intelligence that works for you.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover intelligent tools for productivity, creativity, communication and everyday life across Galaxy smartphones, tablets, and wearables.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/ai"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-500 text-galaxy-950 font-extrabold text-sm hover:opacity-95 transition-all shadow-galaxy-cyan hover:shadow-cyan-500/40 flex items-center justify-center gap-2 group shimmer-btn"
              >
                <span>Explore Galaxy AI</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/ai/demos"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-galaxy-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-galaxy-cyan" />
                <span>Try Live AI Demos</span>
              </Link>
            </div>

            {/* Live Interactive Feature Selector Tabs */}
            <div className="pt-4 border-t border-slate-800/80 max-w-xl mx-auto lg:mx-0">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 justify-center lg:justify-start">
                <Zap className="w-3.5 h-3.5 text-galaxy-cyan" /> Interactive AI Feature Preview:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {HERO_FEATURES.map((feat) => {
                  const Icon = feat.icon;
                  const isSelected = feat.id === activeTab;
                  return (
                    <button
                      key={feat.id}
                      onClick={() => setActiveTab(feat.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-cyan-950/80 border-cyan-400 text-white shadow-galaxy-cyan scale-[1.02]"
                          : "bg-galaxy-900/60 border-slate-800 text-gray-400 hover:text-gray-200 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-galaxy-cyan" : "text-gray-400"}`} />
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                      </div>
                      <span className="text-[11px] font-bold truncate block">{feat.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="p-3 rounded-2xl bg-galaxy-900/40 border border-slate-800">
                <div className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-1">
                  <Cpu className="w-4 h-4 text-cyan-400" /> 45 TOPS
                </div>
                <div className="text-[10px] text-gray-400">Quantum NPU Speed</div>
              </div>
              <div className="p-3 rounded-2xl bg-galaxy-900/40 border border-slate-800">
                <div className="text-xl sm:text-2xl font-extrabold text-galaxy-cyan flex items-center gap-1">
                  <Languages className="w-4 h-4 text-galaxy-cyan" /> 16+
                </div>
                <div className="text-[10px] text-gray-400">Live Languages</div>
              </div>
              <div className="p-3 rounded-2xl bg-galaxy-900/40 border border-slate-800">
                <div className="text-xl sm:text-2xl font-extrabold text-indigo-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" /> 100%
                </div>
                <div className="text-[10px] text-gray-400">Knox On-Device</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Showcase Stage */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Glassmorphic device card */}
            <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-galaxy-850/90 to-galaxy-950/95 border border-cyan-500/35 p-6 shadow-2xl shadow-cyan-950/80 backdrop-blur-2xl transition-all duration-300">
              
              {/* Floating feature badge */}
              <div className="absolute -top-4 -right-2 sm:-right-4 p-3 rounded-2xl bg-galaxy-900/95 border border-cyan-500/40 shadow-xl backdrop-blur-md flex items-center gap-3 text-xs text-white z-20 animate-in fade-in zoom-in duration-300">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${currentFeature.color} text-white flex items-center justify-center shadow-md`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    {currentFeature.title}
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-galaxy-cyan text-[9px] font-extrabold border border-cyan-500/30">
                      {currentFeature.badge}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400">{currentFeature.subtitle}</div>
                </div>
              </div>

              {/* Hero Image / Stage Visual */}
              <div className="relative h-80 w-full flex flex-col items-center justify-center p-2 group">
                <img
                  src={currentFeature.img}
                  alt={currentFeature.title}
                  className="max-h-64 max-w-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,240,255,0.25)] transition-transform duration-500 group-hover:scale-105"
                />

                {/* Circle to search overlay ring if circle tab active */}
                {activeTab === "circle-to-search" && (
                  <div className="absolute inset-16 border-2 border-dashed border-cyan-400 rounded-full animate-ping pointer-events-none opacity-40" />
                )}
              </div>

              {/* Preview Description Banner */}
              <div className="mt-2 p-3.5 rounded-2xl bg-galaxy-950/90 border border-slate-800 text-xs space-y-2">
                <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                  {currentFeature.previewText}
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {currentFeature.sampleTag}
                  </span>
                  <Link
                    href={`/ai/features`}
                    className="text-galaxy-cyan font-bold hover:underline"
                  >
                    Learn More &rarr;
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
