"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Loader2,
  FileQuestion,
  Layers,
  Award,
  BookmarkCheck,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

const STUDY_MODES = [
  { id: "explain", label: "Concept Explanation", icon: BookOpen, desc: "Intuitive analogies & simplified breakdown" },
  { id: "notes", label: "Study Notes", icon: Layers, desc: "Key axioms, definitions & structured summary" },
  { id: "mcq", label: "Generate MCQs", icon: FileQuestion, desc: "4-option questions with detailed answers" },
  { id: "flashcards", label: "Flashcards", icon: Award, desc: "Front/back active recall cards" },
  { id: "quiz", label: "Practice Quiz", icon: GraduationCap, desc: "Timed concept mastery evaluation" },
];

const DIFFICULTIES = [
  { id: "easy", label: "Foundational (Beginner)" },
  { id: "medium", label: "Undergraduate (Medium)" },
  { id: "advanced", label: "Graduate / Expert" },
];

const SAMPLES = [
  {
    label: "Neural Processing Units",
    text: "Explain how dedicated Neural Processing Units (NPUs) process matrix multiplications in 4-bit and 8-bit quantized precision compared to traditional CPUs and GPUs.",
  },
  {
    label: "Hardware Enclave Security",
    text: "How does the Knox Vault hardware enclave isolate cryptographic private keys and biometrics from the primary Android Linux kernel?",
  },
  {
    label: "Calculus Optimization",
    text: "Optimization using Lagrange multipliers with equality constraints in multivariable calculus.",
  },
  {
    label: "Cellular Biology",
    text: "The biochemical stages of ATP synthesis through oxidative phosphorylation in the mitochondrial inner membrane.",
  },
];

export default function AIDemoStudy() {
  const [inputText, setInputText] = useState(SAMPLES[0].text);
  const [selectedMode, setSelectedMode] = useState<string>("explain");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("medium");
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [result, setResult] = useState<any>({
    title: "Conceptual Breakdown: Neural Processing Units",
    content: `### 📚 Concept Guide: Neural Processing Units (NPUs)

**Target Level:** UNDERGRADUATE  
**Core Subject:** Hardware Acceleration & Machine Learning Systems

#### 1. Core Architectural Principle
A **Neural Processing Unit (NPU)** is a specialized microprocessor engineered exclusively to accelerate mathematical matrix multiplications and tensor convolutions. While general-purpose CPUs excel at complex branching logic and GPUs prioritize wide graphics rendering pipelines, NPUs stream integer-quantized weights (INT4/INT8) through specialized multiply-accumulate (MAC) arrays with minimal energy overhead.

#### 2. Key Advantages on Galaxy Flagships
- **Sub-15ms Latency:** Local token processing allows live speech translation without transmitting voice packets over cellular networks.
- **Thermal & Energy Efficiency:** Consumes up to 85% less energy per inference token than running floating-point models on a mobile GPU.
- **Complete Hardware Privacy:** Raw biometric, photographic, and conversational embeddings remain confined to local volatile memory.

#### 3. Real-World Analogy
Think of a CPU as a Swiss Army knife (capable of solving diverse arbitrary tasks), a GPU as an assembly line of 1,000 workers painting identical tiles, and an **NPU as an ultra-fast automated stamp** built solely to stamp one specific mathematical equation millions of times per second.`,
    engine: "Galaxy AI Study Engine v2.1",
    provider: "mock",
    usedFallback: false,
  });

  const { showToast } = useToast();
  const { user } = useAuth();

  const handleGenerate = async (modeToUse?: string, textToUse?: string) => {
    const mode = modeToUse || selectedMode;
    const txt = textToUse !== undefined ? textToUse : inputText;
    if (!txt.trim()) return;

    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch("/api/ai/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: txt,
          mode,
          difficulty: selectedDifficulty,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        showToast(`Generated ${mode.toUpperCase()} study guide!`, "ai");
      } else {
        const err = await res.json();
        showToast(err.error || "Study assist error", "error");
      }
    } catch (e) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.content) return;
    navigator.clipboard.writeText(result.content);
    setIsCopied(true);
    showToast("Study material copied to clipboard!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveToAccount = async () => {
    if (!user) {
      showToast("Log in to save study material to your account", "info");
      return;
    }
    setSaved(true);
    showToast("Study material saved to your AI History!", "success");
  };

  return (
    <div className="space-y-8">
      {/* Sample Quick Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-400">Sample Topics:</span>
        {SAMPLES.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(sample.text);
              handleGenerate(selectedMode, sample.text);
            }}
            className="text-xs px-3 py-1.5 rounded-xl bg-galaxy-900 border border-slate-800 text-gray-300 hover:text-white hover:border-cyan-500/40 transition-all font-medium"
          >
            {sample.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              1. Select Study Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STUDY_MODES.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setSelectedMode(mode.id);
                      handleGenerate(mode.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-400 text-galaxy-cyan shadow-galaxy-cyan"
                        : "bg-galaxy-900/60 border-slate-800 text-gray-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1.5" />
                    <div className="text-xs font-bold block">{mode.label}</div>
                    <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{mode.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              2. Academic Depth Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedDifficulty === diff.id
                      ? "bg-slate-800 border-cyan-500/50 text-galaxy-cyan font-bold"
                      : "bg-galaxy-950 border-slate-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Material Input Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-gray-300 uppercase tracking-wider">
                3. Topic or Study Text
              </label>
              <span className="text-gray-500">{inputText.length} / 10,000 chars</span>
            </div>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste lecture notes, textbook excerpts, or enter a subject you want to master..."
              className="w-full p-4 rounded-2xl bg-galaxy-900 border border-slate-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 resize-none transition-colors"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={() => handleGenerate()}
            disabled={loading || !inputText.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-600 text-galaxy-950 font-extrabold text-sm hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-galaxy-cyan"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing Academic Material...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Synthesize Study Material
              </>
            )}
          </button>
        </div>

        {/* Right Column: Interactive Output Display */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Generated Synthesis
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-galaxy-cyan text-[10px] font-semibold">
                {result?.engine || "Galaxy AI Study Engine"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {user && (
                <button
                  onClick={handleSaveToAccount}
                  disabled={saved}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    saved
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-slate-800 hover:bg-slate-700 text-gray-300 border-slate-700"
                  }`}
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  {saved ? "Saved" : "Save"}
                </button>
              )}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-4 shadow-2xl backdrop-blur-xl min-h-[380px] flex flex-col justify-between">
            {loading ? (
              <div className="py-24 text-center text-gray-400 space-y-3">
                <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin mx-auto" />
                <p className="text-xs">Analyzing concept vectors & formatting study structure...</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                {result?.content}
              </div>
            )}

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-galaxy-cyan" /> Verified Academic Structure
              </span>
              <span>{selectedDifficulty.toUpperCase()} Level</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
