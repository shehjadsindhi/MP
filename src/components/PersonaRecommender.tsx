"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Briefcase, Palette, Compass, User, Sparkles, ArrowRight, CheckCircle2, Bookmark } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface PersonaData {
  id: string;
  name: string;
  icon: any;
  title: string;
  tagline: string;
  features: { name: string; slug: string; reason: string }[];
  devices: { name: string; slug: string; badge: string; image: string }[];
  tutorials: { title: string; slug: string }[];
}

const PERSONAS: PersonaData[] = [
  {
    id: "student",
    name: "Student",
    icon: GraduationCap,
    title: "Accelerate Study, Research & Lectures",
    tagline: "Turn complex 50-page textbooks and recorded lectures into structured study guides in seconds.",
    features: [
      { name: "Note Assist", slug: "note-assist", reason: "Auto-summarize lecture notes into bulleted takeaways" },
      { name: "Circle to Search", slug: "circle-to-search", reason: "Solve calculus and physics equations on-screen" },
      { name: "Transcript Assist", slug: "transcript-assist", reason: "Record professors with multi-speaker diarization" },
      { name: "Live Translate", slug: "live-translate", reason: "Translate foreign language academic literature" },
    ],
    devices: [
      { name: "Galaxy Tab S10 Ultra", slug: "galaxy-tab-s10-ultra", badge: "Ideal Study Canvas", image: "/images/tab_ultra.jpg" },
      { name: "Galaxy S25+", slug: "galaxy-s25-plus", badge: "All-Day Battery Flagship", image: "/images/nova_pro.jpg" },
    ],
    tutorials: [
      { title: "10x Your Meeting & Lecture Productivity with Note Assist", slug: "10x-productivity-with-note-assist-and-s-pen" },
      { title: "Mastering Circle to Search: 10 Hidden Gestures", slug: "mastering-circle-to-search-complete-guide" },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    icon: Briefcase,
    title: "Executive Workflow & Global Communication",
    tagline: "Streamline high-stakes client emails, multi-party meetings, and international business calls.",
    features: [
      { name: "Writing Assist", slug: "writing-assist", reason: "Switch draft messages to formal executive tone" },
      { name: "Live Translate", slug: "live-translate", reason: "Real-time two-way voice call translations" },
      { name: "Note Assist", slug: "note-assist", reason: "Instant executive briefs with assigned action items" },
      { name: "Knox Security", slug: "on-device-vs-cloud-ai-privacy-deep-dive", reason: "Hardware-isolated EAL5+ encryption" },
    ],
    devices: [
      { name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", badge: "Titanium Executive Titan", image: "/images/nova_ultra.jpg" },
      { name: "Galaxy Z Fold 6", slug: "galaxy-z-fold-6", badge: "Dual-Screen Workstation", image: "/images/flex_5.jpg" },
    ],
    tutorials: [
      { title: "Your AI. Your Privacy: On-Device NPU vs Cloud Processing", slug: "on-device-vs-cloud-ai-privacy-deep-dive" },
      { title: "10x Productivity with Note Assist & S-Pen", slug: "10x-productivity-with-note-assist-and-s-pen" },
    ],
  },
  {
    id: "creator",
    name: "Creator",
    icon: Palette,
    title: "Visual Mastery & Generative Media Studio",
    tagline: "Produce studio-grade visuals, eliminate photobombers, and extend cropped compositions with generative AI.",
    features: [
      { name: "Generative Edit", slug: "generative-edit", reason: "Relocate subjects and synthesize missing backgrounds" },
      { name: "AI Photo Editor", slug: "ai-photo-editor", reason: "Erase reflections and upscale dynamic range" },
      { name: "Sketch to Image", slug: "sketch-to-image", reason: "Transform rough S-Pen doodles into photorealistic 3D art" },
      { name: "Circle to Search", slug: "circle-to-search", reason: "Visual inspiration matching across social reels" },
    ],
    devices: [
      { name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", badge: "200MP Pro AI Camera", image: "/images/nova_ultra.jpg" },
      { name: "Galaxy Tab S10 Ultra", slug: "galaxy-tab-s10-ultra", badge: "14.6\" Dynamic AMOLED Canvas", image: "/images/tab_ultra.jpg" },
    ],
    tutorials: [
      { title: "Generative Photo Edit Masterclass: Transform Any Shot", slug: "generative-edit-photo-masterclass" },
      { title: "Mastering Circle to Search: 10 Hidden Gestures", slug: "mastering-circle-to-search-complete-guide" },
    ],
  },
  {
    id: "traveler",
    name: "Traveler",
    icon: Compass,
    title: "Seamless Global Exploration",
    tagline: "Converse fluently abroad without roaming data, decipher foreign menus, and capture unforgettable memories.",
    features: [
      { name: "Interpreter Mode", slug: "interpreter", reason: "Dual-screen split view for face-to-face foreign dialogs" },
      { name: "Live Translate", slug: "live-translate", reason: "Offline voice translation for reservations" },
      { name: "Circle to Search", slug: "circle-to-search", reason: "Instant landmark and architectural identification" },
      { name: "AI Photo Editor", slug: "ai-photo-editor", reason: "Erase tourist crowds from iconic travel photos" },
    ],
    devices: [
      { name: "Galaxy Z Flip 6", slug: "galaxy-z-flip-6", badge: "Pocket-Sized FlexCam AI", image: "/images/flex_5.jpg" },
      { name: "Galaxy Buds3 Pro", slug: "galaxy-buds3-pro", badge: "In-Ear Live Translation", image: "/images/buds_pro.jpg" },
    ],
    tutorials: [
      { title: "The Ultimate Traveler's Guide to Live Translate & Offline Interpreter", slug: "travelers-guide-to-live-translate-and-interpreter" },
      { title: "Your AI. Your Privacy: On-Device NPU vs Cloud Processing", slug: "on-device-vs-cloud-ai-privacy-deep-dive" },
    ],
  },
  {
    id: "everyday",
    name: "Everyday User",
    icon: User,
    title: "Effortless Everyday Intelligence",
    tagline: "Simplify daily messaging, search anything on screen with a circle, and enjoy all-day peace of mind.",
    features: [
      { name: "Circle to Search", slug: "circle-to-search", reason: "Search what you see on social feeds instantly" },
      { name: "Writing Assist", slug: "writing-assist", reason: "Fix grammar and polish friendly chat texts" },
      { name: "AI Photo Remaster", slug: "ai-photo-editor", reason: "One-tap photo enhancement and glare reduction" },
      { name: "Galaxy Watch AI", slug: "galaxy-buds-and-watch-health-ai-ecosystem", reason: "Energy Score and wellness coaching" },
    ],
    devices: [
      { name: "Galaxy S25+", slug: "galaxy-s25-plus", badge: "All-Round Daily Flagship", image: "/images/nova_pro.jpg" },
      { name: "Galaxy Watch Ultra", slug: "galaxy-watch-ultra", badge: "Health & Energy Intelligence", image: "/images/watch_7_pro.jpg" },
    ],
    tutorials: [
      { title: "Biometric Harmony: Galaxy Watch Ultra & Buds3 Pro AI Health", slug: "galaxy-buds-and-watch-health-ai-ecosystem" },
      { title: "Mastering Circle to Search: 10 Hidden Gestures", slug: "mastering-circle-to-search-complete-guide" },
    ],
  },
];

export default function PersonaRecommender() {
  const { user, setSavedPersona } = useAuth();
  const initialPersonaId = user?.savedPersona
    ? PERSONAS.find((p) => p.name.toLowerCase() === user.savedPersona?.toLowerCase())?.id || "student"
    : "student";

  const [activePersonaId, setActivePersonaId] = useState<string>(initialPersonaId);
  const activePersona = PERSONAS.find((p) => p.id === activePersonaId) || PERSONAS[0];

  const handleSaveToAccount = async () => {
    await setSavedPersona(activePersona.name);
  };

  return (
    <section id="persona-section" className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider mb-4 shadow-galaxy-cyan">
            <Sparkles className="w-3.5 h-3.5" /> Galaxy AI For You
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Personalized Intelligence for Your Lifestyle
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mt-3">
            Select your primary persona to instantly discover matching AI capabilities, hardware ecosystems, and tailored guides.
          </p>
        </div>

        {/* Persona Selector Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {PERSONAS.map((persona) => {
            const Icon = persona.icon;
            const isSelected = persona.id === activePersonaId;
            return (
              <button
                key={persona.id}
                onClick={() => setActivePersonaId(persona.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 shadow-galaxy-cyan scale-105"
                    : "bg-galaxy-900/80 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{persona.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Presentation Grid */}
        <div className="rounded-3xl bg-galaxy-900/80 border border-cyan-500/20 shadow-2xl p-6 sm:p-10 backdrop-blur-xl">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-galaxy-cyan uppercase tracking-wider">
                Tailored Recommendation Matrix
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">{activePersona.title}</h3>
              <p className="text-sm text-gray-400 mt-1 max-w-2xl">{activePersona.tagline}</p>
            </div>

            <button
              onClick={handleSaveToAccount}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-gray-200 transition-colors self-start md:self-auto"
            >
              <Bookmark className="w-4 h-4 text-galaxy-cyan" />
              Save Preference to Account
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
            {/* Recommended AI Features */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 text-galaxy-cyan">
                <Sparkles className="w-4 h-4" /> Recommended AI Tools
              </h4>
              <div className="space-y-2.5">
                {activePersona.features.map((feat, idx) => (
                  <Link
                    key={idx}
                    href={`/ai/features/${feat.slug}`}
                    className="block p-3.5 rounded-xl bg-galaxy-950/60 hover:bg-galaxy-950 border border-slate-800/80 hover:border-cyan-500/40 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white group-hover:text-galaxy-cyan transition-colors">
                        {feat.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-galaxy-cyan transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-snug">{feat.reason}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recommended Galaxy Devices */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 text-indigo-400">
                <CheckCircle2 className="w-4 h-4" /> Recommended Hardware
              </h4>
              <div className="space-y-3">
                {activePersona.devices.map((dev, idx) => (
                  <Link
                    key={idx}
                    href={`/devices/${dev.slug}`}
                    className="flex items-center gap-4 p-3.5 rounded-xl bg-galaxy-950/60 hover:bg-galaxy-950 border border-slate-800/80 hover:border-indigo-500/40 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-lg bg-galaxy-900 p-1 flex items-center justify-center flex-shrink-0">
                      <img src={dev.image} alt={dev.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                        {dev.badge}
                      </span>
                      <h5 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                        {dev.name}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recommended Learning Guides & Demos */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 text-emerald-400">
                <GraduationCap className="w-4 h-4" /> Curated Guides & Demos
              </h4>
              <div className="space-y-3">
                {activePersona.tutorials.map((tut, idx) => (
                  <Link
                    key={idx}
                    href={`/learn/${tut.slug}`}
                    className="block p-3.5 rounded-xl bg-galaxy-950/60 hover:bg-galaxy-950 border border-slate-800/80 hover:border-emerald-500/40 transition-all group"
                  >
                    <span className="text-xs font-semibold text-gray-200 group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {tut.title}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1 block">Read Guide &rarr;</span>
                  </Link>
                ))}

                <Link
                  href="/ai/demos"
                  className="block p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 hover:border-cyan-500/60 transition-all text-center"
                >
                  <span className="text-xs font-bold text-galaxy-cyan flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Test In Live AI Demo Lab &rarr;
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
