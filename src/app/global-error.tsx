"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-gray-100 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Application Exception</h2>
            <p className="text-xs text-gray-400">
              An unexpected error occurred during processing. Please refresh or return to safety.
            </p>
            {error?.digest && (
              <p className="text-[11px] font-mono text-gray-500">Digest: {error.digest}</p>
            )}
          </div>

          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
