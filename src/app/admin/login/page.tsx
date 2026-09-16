"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, KeyRound, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAutofillAdmin = () => {
    setEmail("admin@galaxyai.hub");
    setPassword("Admin@123456");
    setError(null);
    showToast("Admin credentials autofilled", "info");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login(email, password);
      if (res.success) {
        // Double-check if the logged in user is actually an ADMIN
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const data = await meRes.json();
          if (data.user?.role !== "ADMIN") {
            setError("Account authenticated, but lacks administrator privileges.");
            showToast("Access Denied: Administrator role required.", "error");
            setLoading(false);
            return;
          }
        }
        showToast("Administrator session authorized!", "success");
        router.push("/admin");
      } else {
        setError(res.error || "Invalid administrator credentials");
        showToast(res.error || "Authentication failed", "error");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-galaxy-950 via-slate-950 to-galaxy-950 text-gray-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Top Branding Card */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 shadow-2xl shadow-indigo-950/50 text-indigo-400 mb-2">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
              Galaxy AI Hub <span className="text-indigo-400 text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 uppercase tracking-widest font-mono">Admin</span>
            </h1>
            <p className="text-xs text-gray-400">
              Restricted Administrative Gateway. Level-3 authorization required.
            </p>
          </div>
        </div>

        {/* Login Box */}
        <div className="rounded-3xl bg-galaxy-900/90 border border-indigo-500/30 p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* 1-Click Autofill Button */}
          <button
            type="button"
            onClick={handleAutofillAdmin}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/90 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group shadow-sm"
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>1-Click Autofill Admin Credentials</span>
          </button>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                <span>Admin Email Address</span>
                <span className="text-[10px] text-gray-500 font-mono">admin@galaxyai.hub</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@galaxyai.hub"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                <span>Passkey / Password</span>
                <span className="text-[10px] text-gray-500 font-mono">Admin@123456</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-indigo-950 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authorize & Enter Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-4 border-t border-slate-800 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hardware-enforced Knox Vault security enclave</span>
            </div>
            <div>
              <Link
                href="/"
                className="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Return to Customer Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
