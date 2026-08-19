"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, User, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    const res = await register(name, email, password);
    setLoading(false);
    if (res.success) {
      router.push("/account");
    } else {
      setError(res.error || "Registration failed");
    }
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Create Galaxy Account</h1>
          <p className="text-xs text-gray-400">
            Join the Galaxy AI Hub to personalize intelligence and sync your devices.
          </p>
        </div>

        {/* Main Register Form */}
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
            <label className="text-xs font-bold text-gray-300">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full bg-galaxy-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full bg-galaxy-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Password (min. 6 characters)</label>
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

          <div className="text-[11px] text-gray-400 pt-1 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-galaxy-cyan flex-shrink-0 mt-0.5" />
            <span>
              Your profile credentials and AI preferences are encrypted with hardware-grade bcrypt hashing.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-600 text-galaxy-950 font-extrabold text-xs hover:opacity-90 shadow-galaxy-cyan transition-opacity flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-galaxy-cyan hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
