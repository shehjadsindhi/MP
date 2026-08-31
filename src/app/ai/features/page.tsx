import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Search, Languages, PenTool, Wand2, FileCheck, Mic, Sliders, MessageSquare, Palette } from "lucide-react";
import { safeGetAIFeatures } from "@/lib/db";

const ICONS: Record<string, any> = {
  "circle-to-search": Search,
  "live-translate": Languages,
  "writing-assist": PenTool,
  "generative-edit": Wand2,
  "note-assist": FileCheck,
  "transcript-assist": Mic,
  "ai-photo-editor": Sliders,
  "interpreter": MessageSquare,
  "sketch-to-image": Palette,
};

export const metadata = {
  title: "All Galaxy AI Features — Galaxy AI Hub",
  description: "Browse the complete suite of Galaxy AI features across productivity, creativity, communication, and visual search.",
};

export default async function AIFeaturesPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const selectedCategory = searchParams?.category || "All";

  const features = await safeGetAIFeatures(selectedCategory);

  const categories = ["All", "Productivity", "Creativity", "Communication", "Search & Vision"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider shadow-galaxy-cyan">
          <Sparkles className="w-3.5 h-3.5" /> Galaxy AI Intelligence Matrix
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore All AI Capabilities
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Discover how each intelligent tool is architected to accelerate your creativity, communication, and workflow.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <Link
              key={cat}
              href={cat === "All" ? "/ai/features" : `/ai/features?category=${cat}`}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 shadow-galaxy-cyan font-bold"
                  : "bg-galaxy-900 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat) => {
          const Icon = ICONS[feat.slug] || Sparkles;
          let supportedDevices: string[] = [];
          try {
            if (feat.supportedDevicesJson) supportedDevices = JSON.parse(feat.supportedDevicesJson);
          } catch (e) {}

          return (
            <div
              key={feat.id}
              className="group rounded-3xl bg-galaxy-900/70 border border-slate-800 hover:border-cyan-500/40 p-7 flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/30 backdrop-blur-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-galaxy-cyan group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  {feat.badge && (
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-cyan-300 text-xs font-bold border border-slate-700">
                      {feat.badge}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-xs font-bold text-galaxy-cyan uppercase tracking-wider block mb-1">
                    {feat.category}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-galaxy-cyan transition-colors">
                    {feat.name}
                  </h3>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {feat.shortDesc}
                </p>

                {supportedDevices.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                      Supported Hardware:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {supportedDevices.slice(0, 3).map((dev, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-galaxy-950 text-[10px] text-gray-400 border border-slate-800"
                        >
                          {dev}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <Link
                  href={`/ai/features/${feat.slug}`}
                  className="text-xs font-bold text-gray-300 hover:text-white transition-colors"
                >
                  Deep-Dive Guide &rarr;
                </Link>

                <Link
                  href="/ai/demos"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-3 h-3" /> Test Demo
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
