import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Smartphone, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6 p-8 sm:p-12 rounded-3xl bg-galaxy-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-galaxy-cyan flex items-center justify-center mx-auto shadow-galaxy-cyan">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-galaxy-cyan uppercase tracking-wider">
            404 • Destination Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Lost in the Galaxy
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
            The page or device feature you are looking for has been relocated or is currently in development.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-galaxy-cyan"
          >
            <span>Return to Galaxy Home</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/devices"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-galaxy-950 hover:bg-slate-800 border border-slate-700 text-gray-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 text-galaxy-cyan" />
            <span>Explore Devices</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
