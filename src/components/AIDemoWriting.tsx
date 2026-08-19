"use client";

import React, { useState } from "react";
import { PenTool, Sparkles, Copy, Check, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

const TONES = [
  { id: "Professional", label: "Professional", desc: "Executive business formality" },
  { id: "Casual", label: "Casual & Friendly", desc: "Relaxed social phrasing" },
  { id: "Polite", label: "Polite & Gracious", desc: "High courtesy and respect" },
  { id: "Social", label: "Social Media Post", desc: "Catchy emojis & hashtags" },
  { id: "Concise", label: "Make Shorter", desc: "Brief, high-impact clarity" },
  { id: "Academic", label: "Academic", desc: "Scholarly and rigorous" },
  { id: "Bullet Points", label: "Bullet Points", desc: "Structured hierarchical list" },
];

const SAMPLE_TEXT = "Hey team, just wanted to check if the new galaxy ai designs are ready. Need to send them to the client before tomorrow afternoon. thanks.";

export default function AIDemoWriting() {
  const [inputText, setInputText] = useState(SAMPLE_TEXT);
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [result, setResult] = useState<any>({
    originalText: SAMPLE_TEXT,
    tone: "Professional",
    improvedText: "Dear Team,\n\nI am writing to respectfully inquire regarding the completion status of the updated Galaxy AI design assets. It is imperative that we deliver the finalized deliverables to the client prior to tomorrow afternoon.\n\nThank you for your continued dedication.\n\nBest regards,",
    wordCountOriginal: 27,
    wordCountImproved: 42,
    grammarIssuesFixed: 3,
    suggestions: [
      "Replaced informal salutations with executive correspondence standards.",
      "Enhanced urgency with courteous professional deadlines.",
    ],
    engine: "Galaxy Quantum NPU Writing Engine",
  });

  const { showToast } = useToast();

  const handleRewrite = async (toneToUse?: string) => {
    const tone = toneToUse || selectedTone;
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, tone }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        showToast(`Rewritten in ${tone} tone!`, "ai");
      }
    } catch (e) {
      showToast("Writing assist error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.improvedText);
    setIsCopied(true);
    showToast("Transformed text copied to clipboard!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Notice */}
      <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 text-cyan-300">
          <PenTool className="w-4 h-4 text-galaxy-cyan flex-shrink-0" />
          <span>
            <strong>Writing Assist Demo:</strong> Built directly into Samsung Keyboard. Switch tones, fix grammar, and summarize drafts on-device.
          </span>
        </div>
        <span className="bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold border border-cyan-400/30">
          Samsung Keyboard NPU
        </span>
      </div>

      {/* Tone Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {TONES.map((t) => {
          const isSelected = selectedTone === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTone(t.id);
                handleRewrite(t.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 shadow-galaxy-cyan font-bold"
                  : "bg-galaxy-900 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Main Panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Textarea */}
        <div className="rounded-2xl bg-galaxy-900 border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
              <span>Your Draft Message</span>
              <button
                onClick={() => setInputText(SAMPLE_TEXT)}
                className="text-galaxy-cyan hover:underline text-[11px] font-normal"
              >
                Reset to Sample
              </button>
            </div>
            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type any email, chat message, or draft..."
              className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">
              Words: {inputText.split(/\s+/).filter(Boolean).length}
            </span>
            <button
              onClick={() => handleRewrite()}
              disabled={loading || !inputText.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shadow-galaxy-cyan"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Rewriting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Transform to {selectedTone}
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Rewritten Output */}
        <div className="rounded-2xl bg-galaxy-900 border border-cyan-500/30 p-5 flex flex-col justify-between space-y-4 shadow-lg shadow-cyan-950/20">
          <div>
            <div className="flex items-center justify-between text-xs text-galaxy-cyan font-bold uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Galaxy AI ({selectedTone} Tone)
              </span>
              <span className="text-emerald-400 text-[11px] font-semibold">
                ✓ {result.grammarIssuesFixed || 2} Grammar Polished
              </span>
            </div>

            <div className="w-full min-h-[190px] bg-galaxy-950 border border-cyan-500/20 rounded-xl p-4 text-sm text-cyan-100 whitespace-pre-line leading-relaxed select-text">
              {result.improvedText}
            </div>

            {result.suggestions && result.suggestions.length > 0 && (
              <div className="mt-3 space-y-1">
                {result.suggestions.map((s: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-galaxy-cyan flex-shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <span className="text-xs text-gray-500">
              Transformed Words: {result.wordCountImproved || 0}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-galaxy-950 hover:bg-slate-800 border border-slate-700 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {isCopied ? "Copied" : "Copy to Clipboard"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
