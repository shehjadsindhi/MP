"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Wand2, Languages, PenTool, FileCheck, Search, Cpu, Loader2 } from "lucide-react";
import AIDemoPhoto from "@/components/AIDemoPhoto";
import AIDemoTranslate from "@/components/AIDemoTranslate";
import AIDemoWriting from "@/components/AIDemoWriting";
import AIDemoNotes from "@/components/AIDemoNotes";
import AIDemoSearch from "@/components/AIDemoSearch";

const DEMO_TABS = [
  { id: "photo", label: "Photo Edit", icon: Wand2, badge: "Generative Studio" },
  { id: "translation", label: "Live Translation", icon: Languages, badge: "On-Device" },
  { id: "writing", label: "Writing Assist", icon: PenTool, badge: "Tone Changer" },
  { id: "notes", label: "Note Assist", icon: FileCheck, badge: "Tasks & OCR" },
  { id: "search", label: "Circle to Search", icon: Search, badge: "Google AI" },
];

function AIDemosInner() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "photo";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && DEMO_TABS.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider shadow-galaxy-cyan">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> Interactive Quantum NPU Simulator
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Galaxy AI Interactive Studio
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Experience real-time on-device and cloud-assisted intelligence. Test photo remastering, voice translations, document synthesis, and multimodal search.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {DEMO_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-600 text-galaxy-950 shadow-galaxy-cyan font-bold scale-105"
                  : "bg-galaxy-900/80 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-galaxy-950" : "text-galaxy-cyan"}`} />
              <span>{tab.label}</span>
              <span
                className={`hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                  isActive
                    ? "bg-galaxy-950/20 text-galaxy-950"
                    : "bg-slate-800 text-cyan-300 border border-slate-700"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Demo Active Viewport Container */}
      <div className="mt-8">
        {activeTab === "photo" && <AIDemoPhoto />}
        {activeTab === "translation" && <AIDemoTranslate />}
        {activeTab === "writing" && <AIDemoWriting />}
        {activeTab === "notes" && <AIDemoNotes />}
        {activeTab === "search" && <AIDemoSearch />}
      </div>
    </div>
  );
}

export default function AIDemosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
          <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin" />
        </div>
      }
    >
      <AIDemosInner />
    </Suspense>
  );
}
