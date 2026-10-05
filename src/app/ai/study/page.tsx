import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, GraduationCap } from "lucide-react";
import AIDemoStudy from "@/components/AIDemoStudy";

export const metadata = {
  title: "AI Study Assistant — Galaxy AI Hub",
  description: "Accelerate your learning with Galaxy AI: explain complex topics, generate exam MCQs, create structured study notes and flashcards.",
};

export default function AIStudyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-galaxy-cyan text-xs font-bold uppercase tracking-wider shadow-galaxy-cyan backdrop-blur-md">
          <GraduationCap className="w-4 h-4 text-cyan-400" /> Academic Neural Copilot
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Galaxy AI Study Assistant
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Transform dense lecture notes and complex concepts into intuitive explanations, active-recall flashcards, and exam-ready practice questions.
        </p>
      </div>

      {/* Main Interactive Tool */}
      <div className="pt-4">
        <AIDemoStudy />
      </div>

      {/* Bottom Navigation */}
      <div className="pt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-gray-400">
        <Link href="/ai/demos" className="hover:text-white flex items-center gap-1.5 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> All Interactive AI Demos
        </Link>
        <Link href="/account/saved-ai" className="hover:text-cyan-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-galaxy-cyan" /> View Your Saved AI History
        </Link>
      </div>
    </div>
  );
}
