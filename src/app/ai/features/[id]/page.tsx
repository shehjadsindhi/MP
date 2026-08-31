import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  Cpu,
  ShieldCheck,
  Search,
  Languages,
  PenTool,
  Wand2,
  FileCheck,
  Mic,
  Sliders,
  MessageSquare,
  Palette
} from "lucide-react";
import { safeGetAIFeatureByIdOrSlug, safeGetAIFeatures } from "@/lib/db";

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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const feature = await safeGetAIFeatureByIdOrSlug(params.id);
  if (!feature) return { title: "Feature Not Found — Galaxy AI Hub" };
  return {
    title: `${feature.name} — Galaxy AI Feature Deep Dive`,
    description: feature.shortDesc,
  };
}

export default async function AIFeatureDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const feature = await safeGetAIFeatureByIdOrSlug(params.id);

  if (!feature) {
    notFound();
  }

  const allCategoryFeatures = await safeGetAIFeatures(feature.category);
  const relatedFeatures = allCategoryFeatures.filter((f) => f.id !== feature.id).slice(0, 3);

  let supportedDevices: string[] = [];
  let benefits: string[] = [];
  let howItWorks: string[] = [];
  let faqs: { q: string; a: string }[] = [];

  try {
    if (feature.supportedDevicesJson) supportedDevices = JSON.parse(feature.supportedDevicesJson);
    if (feature.benefitsJson) benefits = JSON.parse(feature.benefitsJson);
    if (feature.howItWorksJson) howItWorks = JSON.parse(feature.howItWorksJson);
    if (feature.faqsJson) faqs = JSON.parse(feature.faqsJson);
  } catch (e) {}

  const Icon = ICONS[feature.slug] || Sparkles;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 pb-24">
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/ai/features" className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> All AI Features
        </Link>
        <span>/</span>
        <span className="text-galaxy-cyan font-semibold">{feature.name}</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-galaxy-900 via-galaxy-850 to-galaxy-900 border border-cyan-500/30 p-8 sm:p-12 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-galaxy-cyan shadow-galaxy-cyan flex-shrink-0">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-galaxy-cyan uppercase tracking-wider">
                  {feature.category}
                </span>
                {feature.badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 text-[10px] font-bold border border-slate-700">
                    {feature.badge}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                {feature.name}
              </h1>
            </div>
          </div>

          <Link
            href="/ai/demos"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-500 text-galaxy-950 font-bold text-sm hover:opacity-95 shadow-galaxy-cyan transition-all flex items-center justify-center gap-2 self-start sm:self-auto flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Try Live Demo
          </Link>
        </div>

        <p className="text-base text-gray-200 leading-relaxed max-w-4xl">
          {feature.fullDesc || feature.shortDesc}
        </p>
      </div>

      {/* Grid: How It Works & Core Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step-by-Step Execution */}
        <div className="rounded-3xl bg-galaxy-900/60 border border-slate-800 p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-galaxy-cyan" /> How It Works
          </h2>

          <div className="space-y-4">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-xl bg-cyan-950 border border-cyan-500/40 text-galaxy-cyan font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="rounded-3xl bg-galaxy-900/60 border border-slate-800 p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" /> Key Benefits & Privacy
          </h2>

          <div className="space-y-3.5">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supported Hardware Matrix */}
      {supportedDevices.length > 0 && (
        <div className="rounded-3xl bg-galaxy-900/60 border border-slate-800 p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-galaxy-cyan" /> Supported Galaxy Devices
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {supportedDevices.map((dev, idx) => (
              <Link
                key={idx}
                href="/devices"
                className="p-4 rounded-2xl bg-galaxy-950 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
              >
                <span className="text-xs font-semibold text-white group-hover:text-galaxy-cyan transition-colors">
                  {dev}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Frequently Asked Questions */}
      {faqs.length > 0 && (
        <div className="rounded-3xl bg-galaxy-900/60 border border-slate-800 p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-galaxy-950 border border-slate-800/80 space-y-1.5">
                <h4 className="text-sm font-bold text-white">{faq.q}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related AI Features */}
      {relatedFeatures.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Related AI Tools in {feature.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedFeatures.map((rel) => (
              <Link
                key={rel.id}
                href={`/ai/features/${rel.slug}`}
                className="p-6 rounded-2xl bg-galaxy-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group"
              >
                <h3 className="font-bold text-white group-hover:text-galaxy-cyan transition-colors text-base mb-1">
                  {rel.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">{rel.shortDesc}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
