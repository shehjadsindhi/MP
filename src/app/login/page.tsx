"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      router.push("/account");
    } else {
      setError(res.error || "Invalid credentials");
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail("admin@galaxyai.hub");
    setPassword("Admin@123456");
    showToast("Filled Admin demo credentials!", "info");
  };

  const handleFillDemoUser = () => {
    setEmail("user@galaxyai.hub");
    setPassword("User@123456");
    showToast("Filled Customer demo credentials!", "info");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-galaxy-cyan to-indigo-600 p-0.5 shadow-galaxy-cyan mx-auto">
            <div className="w-full h-full bg-galaxy-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-galaxy-cyan" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Sign In to Galaxy AI Hub</h1>
          <p className="text-xs text-gray-400">
            Access your personalized AI recommendations, orders, and hardware ecosystem.
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Card */}
        <div className="rounded-2xl bg-cyan-950/30 border border-cyan-500/30 p-4 space-y-2 text-xs">
          <span className="text-[11px] font-bold text-galaxy-cyan uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Quick Demo Credentials:
          </span>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 font-bold text-left transition-colors flex items-center justify-between"
            >
              <span>👑 Demo Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleFillDemoUser}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-left transition-colors flex items-center justify-between"
            >
              <span>👤 Demo User</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Login Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-4 shadow-2xl backdrop-blur-xl"
        >
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-galaxy-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-gray-300">Password</label>
              <button
                type="button"
                onClick={() => showToast("Password reset link sent to demo email", "info")}
                className="text-galaxy-cyan hover:underline text-[11px]"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-galaxy-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-600 text-galaxy-950 font-extrabold text-xs hover:opacity-90 shadow-galaxy-cyan transition-opacity flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-bold text-galaxy-cyan hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
