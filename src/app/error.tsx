"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Sparkles, RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Galaxy AI Hub Runtime Exception Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-galaxy-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-galaxy-cyan flex items-center justify-center mx-auto shadow-galaxy-cyan">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-galaxy-cyan uppercase tracking-wider">
            Galaxy AI Quantum Recovery
          </span>
          <h2 className="text-2xl font-extrabold text-white">
            Temporary System Interruption
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            The Galaxy AI engine encountered a temporary exception. Our resilient fallback protocols are active.
          </p>
          {error?.digest && (
            <div className="mt-2 inline-block px-3 py-1 rounded-lg bg-galaxy-950 border border-slate-800 text-[11px] font-mono text-gray-400">
              Digest: {error.digest}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-galaxy-cyan"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-galaxy-950 hover:bg-slate-800 border border-slate-700 text-gray-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
