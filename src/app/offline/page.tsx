import Link from "next/link";
import { WifiOff, RefreshCw, ArrowLeft } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-galaxy-950 text-gray-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-galaxy-cyan" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white">You&apos;re Offline</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Check your internet connection and try again. Some content may still be available from cache.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-galaxy-900 border border-slate-800 text-white font-bold text-sm hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
