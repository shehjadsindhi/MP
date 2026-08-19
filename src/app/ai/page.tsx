import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Cpu, Shield, Zap, Layers, Smartphone, Tablet, Watch, Headphones, Search, Languages, Wand2, PenTool } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Galaxy AI Hub — Next-Gen Intelligence Ecosystem",
  description: "Explore on-device NPU processing, real-time live translation, generative photo editing, and seamless multi-device synergy.",
};

export default async function AIPage() {
  const features = await prisma.aIFeature.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-24 py-12 pb-24">
      {/* 1. Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider shadow-galaxy-cyan">
          <Sparkles className="w-3.5 h-3.5" /> Galaxy AI Intelligence Platform
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          Next-Gen AI for Everyday Life
        </h1>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Powered by state-of-the-art Quantum NPUs and Google AI integration. Experience seamless real-time translation, generative creativity, and frictionless productivity.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/ai/demos"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-500 text-galaxy-950 font-bold text-sm hover:opacity-95 shadow-galaxy-cyan transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Try Interactive AI Demos
          </Link>
          <Link
            href="/ai/features"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-galaxy-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            Browse All 9 Features <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 2. Architecture: On-Device NPU vs Cloud Hybrid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-galaxy-900/60 border border-slate-800 p-8 sm:p-12 space-y-8 backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Hybrid AI Architecture: Speed & Sovereignty
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Galaxy AI dynamically routes computational tasks to the optimal processor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* On-Device NPU */}
            <div className="p-8 rounded-2xl bg-galaxy-950/80 border border-cyan-500/30 space-y-4 shadow-lg shadow-cyan-950/20">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-galaxy-cyan">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Quantum NPU (On-Device)</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Executes sensitive workloads directly inside your device hardware without internet. Operates with sub-15ms latency and zero external data transmission.
              </p>
              <ul className="space-y-2 text-xs text-gray-400 pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-galaxy-cyan font-bold">✓</span> Live Translate (Two-way phone calls)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-galaxy-cyan font-bold">✓</span> Interpreter Mode (Face-to-face conversations)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-galaxy-cyan font-bold">✓</span> Writing Assist Tone Correction
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-galaxy-cyan font-bold">✓</span> Knox Vault Hardware Enclave Isolation
                </li>
              </ul>
            </div>

            {/* Cloud Neural Clusters */}
            <div className="p-8 rounded-2xl bg-galaxy-950/80 border border-indigo-500/30 space-y-4 shadow-lg shadow-indigo-950/20">
              <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Cloud Neural Clusters</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Leverages massive multi-billion parameter neural networks for heavy generative fill, multi-source document synthesis, and multimodal Google search reasoning.
              </p>
              <ul className="space-y-2 text-xs text-gray-400 pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> Generative Edit & Background Synthesis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> Circle to Search with Google AI Overviews
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> 50-Page PDF Document Summarization
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> Master Toggle: Option to turn off cloud processing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Connected Ecosystem */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-white">
            Universal AI Across Your Galaxy Devices
          </h2>
          <p className="text-sm text-gray-400">
            Galaxy AI follows you across smartphones, foldables, tablets, smartwatches, and wireless audio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-galaxy-900/60 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-galaxy-cyan">
              <Smartphone className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Galaxy S25 Ultra</h4>
            <p className="text-xs text-gray-400">
              Complete on-device AI suite, 200MP Generative Camera, and S-Pen Sketch to Image.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-galaxy-900/60 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Galaxy Z Fold 6</h4>
            <p className="text-xs text-gray-400">
              Dual-screen Interpreter mode, split-screen Note Assist, and foldable multi-window AI.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-galaxy-900/60 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-purple-400">
              <Tablet className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Galaxy Tab S10 Ultra</h4>
            <p className="text-xs text-gray-400">
              14.6&quot; Dynamic AMOLED canvas with PDF Overlay Translation and Handwriting OCR.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-galaxy-900/60 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <Headphones className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Galaxy Buds3 Pro & Watch</h4>
            <p className="text-xs text-gray-400">
              Hands-free whisper translation, AI Energy Score, and real-time biometric wellness.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CTA to Demos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-950/60 via-galaxy-900 to-indigo-950/60 border border-cyan-500/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <Sparkles className="w-10 h-10 text-galaxy-cyan mx-auto animate-bounce" />
          <h2 className="text-3xl font-extrabold text-white">
            Experience Galaxy AI Right in Your Browser
          </h2>
          <p className="text-sm text-gray-300 max-w-xl mx-auto">
            Test our live interactive demos for Photo Editing, Live Translation, Writing Tone Assist, Note Structuring, and Search.
          </p>
          <Link
            href="/ai/demos"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-500 text-galaxy-950 font-extrabold text-sm hover:opacity-95 shadow-galaxy-cyan transition-all"
          >
            Launch AI Demo Studio <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
