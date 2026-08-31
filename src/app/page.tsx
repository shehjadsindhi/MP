import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Shield,
  Layers,
  Zap,
  Search,
  Languages,
  PenTool,
  Wand2,
  FileCheck,
  Mic,
  Sliders,
  MessageSquare,
  Palette,
  CheckCircle2,
  Star,
  Smartphone,
  Flame
} from "lucide-react";
import { safeGetProducts, safeGetAIFeatures, safeGetArticles, safeGetOffers } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import PersonaRecommender from "@/components/PersonaRecommender";

const FEATURE_ICONS: Record<string, any> = {
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

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const [featuredProducts, aiFeatures, latestArticles, activeOffers] = await Promise.all([
    safeGetProducts({ featured: true }),
    safeGetAIFeatures(),
    safeGetArticles(),
    safeGetOffers(),
  ]);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-8 pb-16">
        {/* Background glow & radial galaxy effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute inset-0 galaxy-stars-bg opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-galaxy-900/90 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider shadow-galaxy-cyan backdrop-blur-xl">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
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
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-500 text-galaxy-950 font-bold text-sm hover:opacity-95 transition-all shadow-galaxy-cyan hover:shadow-cyan-500/40 flex items-center justify-center gap-2 group"
                >
                  <span>Explore Galaxy AI</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/ai/demos"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-galaxy-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-galaxy-cyan" />
                  <span>Try Live AI Demos</span>
                </Link>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-2xl font-extrabold text-white">45 TOPS</div>
                  <div className="text-[11px] text-gray-400">Quantum NPU Speed</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-galaxy-cyan">16+</div>
                  <div className="text-[11px] text-gray-400">Live Languages</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-indigo-400">100%</div>
                  <div className="text-[11px] text-gray-400">On-Device Privacy</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Glassmorphic device card */}
              <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-galaxy-850/80 to-galaxy-950/90 border border-cyan-500/30 p-6 shadow-2xl shadow-cyan-950/60 backdrop-blur-2xl animate-float">
                {/* Floating mini tool card */}
                <div className="absolute -top-4 -right-4 p-3 rounded-2xl bg-galaxy-900/90 border border-cyan-500/40 shadow-xl backdrop-blur-md flex items-center gap-2.5 text-xs text-white z-20">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-galaxy-cyan flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[11px]">Circle to Search</div>
                    <div className="text-[9px] text-gray-400">Instant visual lookup</div>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="relative h-80 w-full flex items-center justify-center p-4">
                  <img
                    src="/images/nova_ultra.jpg"
                    alt="Galaxy S25 Ultra"
                    className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
                  />
                </div>

                {/* Bottom interactive ticker */}
                <div className="mt-2 p-3.5 rounded-2xl bg-galaxy-950/90 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white">Galaxy S25 Ultra</span>
                  </div>
                  <span className="text-galaxy-cyan font-mono font-semibold">$1,299.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE GALAXY AI FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider mb-2 shadow-galaxy-cyan">
              <Sparkles className="w-3.5 h-3.5" /> Breakthrough Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Galaxy AI
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              From instant translation during phone calls to generative photo editing, experience intelligence designed for your everyday workflow.
            </p>
          </div>

          <Link
            href="/ai/features"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-galaxy-cyan hover:underline self-start md:self-auto"
          >
            View All AI Features <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 8 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiFeatures.map((feat) => {
            const Icon = FEATURE_ICONS[feat.slug] || Sparkles;
            return (
              <div
                key={feat.id}
                className="group rounded-2xl bg-galaxy-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between space-y-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/30"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-galaxy-cyan group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    {feat.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-gray-300 text-[10px] font-bold border border-slate-700">
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-galaxy-cyan uppercase tracking-wider block mb-1">
                      {feat.category}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-galaxy-cyan transition-colors">
                      {feat.name}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                    {feat.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <Link
                    href={`/ai/features/${feat.slug}`}
                    className="text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                  >
                    Learn More &rarr;
                  </Link>

                  <Link
                    href="/ai/demos"
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Try Demo
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. AI PERSONALIZATION ("Galaxy AI for You") */}
      <PersonaRecommender />

      {/* 4. FEATURED GALAXY HARDWARE MARKETPLACE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider mb-2 shadow-galaxy-cyan">
              <Smartphone className="w-3.5 h-3.5" /> Hardware Synergy
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Flagship Galaxy Devices
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              Engineered with dedicated Neural Processing Units (NPUs) to execute complex AI models locally with zero data latency.
            </p>
          </div>

          <Link
            href="/devices"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-galaxy-cyan hover:underline self-start md:self-auto"
          >
            Explore All Devices <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </section>

      {/* 5. ACTIVE PROMOTIONS TEASER */}
      {activeOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeOffers.map((offer) => (
              <div
                key={offer.id}
                className="relative rounded-3xl bg-gradient-to-r from-galaxy-900 to-galaxy-850 border border-cyan-500/30 p-6 sm:p-8 overflow-hidden flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-galaxy-cyan text-xs font-bold border border-cyan-500/40">
                    {offer.badge || "Exclusive Deal"}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40">
                    CODE: {offer.code}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{offer.title}</h3>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{offer.description}</p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href="/offers"
                    className="text-xs font-bold text-galaxy-cyan hover:underline flex items-center gap-1"
                  >
                    Claim Promotion <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/devices"
                    className="px-4 py-2 rounded-xl bg-galaxy-cyan text-galaxy-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
                  >
                    Shop Eligible
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. PRIVACY & KNOX SECURITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-galaxy-900 via-galaxy-850 to-galaxy-950 border border-cyan-500/30 p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" /> Your AI. Your Privacy.
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Complete Data Protection with Knox Vault & On-Device Processing
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Your private conversations, audio recordings, and notes belong strictly to you. With Galaxy AI, you decide whether features execute on-device via Quantum NPU or utilize cloud clusters.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-galaxy-cyan flex-shrink-0 mt-0.5" />
                  <span>EAL5+ certified hardware isolated vault</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-galaxy-cyan flex-shrink-0 mt-0.5" />
                  <span>Master toggle for 100% on-device AI only</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-galaxy-cyan flex-shrink-0 mt-0.5" />
                  <span>Zero cloud data retention policy</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-galaxy-cyan flex-shrink-0 mt-0.5" />
                  <span>Real-time on-device biometric defense</span>
                </div>
              </div>
              <div className="pt-4">
                <Link
                  href="/learn/on-device-vs-cloud-ai-privacy-deep-dive"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-colors"
                >
                  Read Security Whitepaper <ArrowRight className="w-4 h-4 text-galaxy-cyan" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center p-6 shadow-2xl shadow-cyan-500/20 animate-pulse-glow">
                <Shield className="w-24 h-24 text-galaxy-cyan" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LATEST AI GUIDES & TUTORIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" /> Learning Hub
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Master Galaxy AI
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              In-depth tutorials, expert tips, and pro gestures to elevate your productivity.
            </p>
          </div>

          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-galaxy-cyan hover:underline self-start md:self-auto"
          >
            View All Guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map((art) => (
            <Link
              key={art.id}
              href={`/learn/${art.slug}`}
              className="group rounded-2xl bg-galaxy-900/60 border border-slate-800 hover:border-cyan-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/20"
            >
              <div className="h-48 w-full bg-galaxy-850 p-6 flex items-center justify-center overflow-hidden">
                <img
                  src={art.image}
                  alt={art.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-galaxy-cyan font-semibold">{art.category}</span>
                    <span className="text-gray-500">{art.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-galaxy-cyan transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-gray-400">
                  <span>By {art.author.split(",")[0]}</span>
                  <span className="text-galaxy-cyan font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
