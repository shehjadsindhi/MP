"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Wand2, Languages, PenTool, FileCheck, Search, Info, Loader2, Smartphone, Tablet, Monitor } from "lucide-react";
import AIDemoPhoto from "@/components/AIDemoPhoto";
import AIDemoTranslate from "@/components/AIDemoTranslate";
import AIDemoWriting from "@/components/AIDemoWriting";
import AIDemoNotes from "@/components/AIDemoNotes";
import AIDemoSearch from "@/components/AIDemoSearch";

const DEMO_TABS = [
  { id: "photo", label: "Photo Edit", icon: Wand2, badge: "Generative Studio" },
  { id: "translation", label: "Live Translation", icon: Languages, badge: "On-Device NPU" },
  { id: "writing", label: "Writing Assist", icon: PenTool, badge: "Tone Changer" },
  { id: "notes", label: "Note Assist", icon: FileCheck, badge: "Tasks & OCR" },
  { id: "search", label: "Circle to Search", icon: Search, badge: "Google AI" },
];

const DEVICE_FRAMES = [
  {
    id: "s25ultra",
    label: "S25 Ultra",
    icon: Smartphone,
    badge: "45 TOPS NPU",
    hint: "Titanium flagship with 200MP camera & dedicated S-Pen groove.",
    accentColor: "from-cyan-500 to-blue-600",
  },
  {
    id: "zfold6",
    label: "Z Fold 6",
    icon: Monitor,
    badge: "Flex NPU",
    hint: "Unfolds into a 7.6\" tablet. Dual-screen multitasking + FlexCam.",
    accentColor: "from-indigo-500 to-purple-600",
  },
  {
    id: "tabs10",
    label: "Tab S10 Ultra",
    icon: Tablet,
    badge: "14.6\" Canvas",
    hint: "Pro-grade AMOLED tablet with S-Pen for generative editing and note-taking.",
    accentColor: "from-emerald-500 to-teal-600",
  },
];

function AIDemosInner() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam && DEMO_TABS.some((t) => t.id === tabParam) ? tabParam : "photo");
  const [activeDevice, setActiveDevice] = useState(DEVICE_FRAMES[0].id);

  useEffect(() => {
    if (tabParam && DEMO_TABS.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const currentDevice = DEVICE_FRAMES.find((d) => d.id === activeDevice) || DEVICE_FRAMES[0];
  const DeviceIcon = currentDevice.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-galaxy-cyan text-xs font-bold uppercase tracking-wider shadow-galaxy-cyan backdrop-blur-md">
          <Sparkles className="w-4 h-4 animate-pulse" /> Interactive Concept Simulator
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Galaxy AI Interactive Studio
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Test interactive demonstrations of photo remastering, voice translations, document synthesis, and multimodal visual search.
        </p>
      </div>

      {/* Device Frame Selector */}
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-galaxy-cyan" /> Simulating on Device:
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {DEVICE_FRAMES.map((device) => {
            const Icon = device.icon;
            const isActive = activeDevice === device.id;
            return (
              <button
                key={device.id}
                onClick={() => setActiveDevice(device.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${device.accentColor} text-white border-transparent shadow-xl scale-105`
                    : "bg-galaxy-900/80 border-slate-800 text-gray-300 hover:text-white hover:border-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{device.label}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-800 text-galaxy-cyan border border-slate-700"
                }`}>
                  {device.badge}
                </span>
              </button>
            );
          })}
        </div>
        {/* Contextual device hint */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-gray-400">
          <DeviceIcon className={`w-3.5 h-3.5 bg-gradient-to-r ${currentDevice.accentColor}`} />
          <span className="font-medium">{currentDevice.hint}</span>
        </div>
      </div>

      {/* Simulator Disclosure Notice */}
      <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-galaxy-900/60 border border-slate-800 flex items-start gap-3 text-xs text-gray-300">
        <Info className="w-4 h-4 text-galaxy-cyan flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Educational Demo Notice:</strong> This interactive studio is a client-side simulation engineered to demonstrate how Galaxy AI tools operate on device hardware. Responses illustrate real-world device workflows.
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap" role="tablist">
        {DEMO_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
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
