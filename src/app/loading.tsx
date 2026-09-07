import React from "react";
import { Loader2, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-gray-400 gap-4">
      <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-galaxy-cyan shadow-galaxy-cyan animate-pulse">
        <Sparkles className="w-7 h-7" />
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
        <Loader2 className="w-4 h-4 text-galaxy-cyan animate-spin" />
        <span>Loading Galaxy AI Experience...</span>
      </div>
    </div>
  );
}
