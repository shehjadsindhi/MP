"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Languages,
  PenTool,
  FileText,
  Search,
  Image as ImageIcon,
  Loader2,
  TrendingUp,
  Clock,
  BookOpen,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";

const DEMO_TITLES: Record<string, string> = {
  chat: "Chat",
  translate: "Translate",
  rewrite: "Rewrite",
  notes: "Notes Assist",
  search: "AI Search",
  photo: "Photo Edit",
  study: "Study Assistant",
  "device-finder": "Device Finder",
  "shopping-assistant": "Shopping Assistant",
};

const AI_TOOLS = [
  { key: "chat", label: "AI Chat", icon: MessageCircle, color: "text-cyan-400", href: "/ai/demos?tab=chat" },
  { key: "translate", label: "Translate", icon: Languages, color: "text-indigo-400", href: "/ai/demos?tab=translation" },
  { key: "writing", label: "Writing", icon: PenTool, color: "text-purple-400", href: "/ai/demos?tab=writing" },
  { key: "notes", label: "Notes", icon: FileText, color: "text-emerald-400", href: "/ai/demos?tab=notes" },
  { key: "search", label: "Search", icon: Search, color: "text-amber-400", href: "/ai/demos?tab=search" },
  { key: "photo", label: "Photo AI", icon: ImageIcon, color: "text-rose-400", href: "/ai/demos?tab=photo" },
  { key: "study", label: "Study", icon: BookOpen, color: "text-teal-400", href: "/ai/study" },
  { key: "device-finder", label: "Device Finder", icon: Zap, color: "text-blue-400", href: "/ai/device-finder" },
];

export default function AIUsageDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchUsage = async () => {
        try {
          const res = await fetch("/api/user/ai-usage");
          if (res.ok) {
            const data = await res.json();
            setUsage(data);
          }
        } catch (e) {
          console.warn("Failed to fetch AI usage:", e);
        } finally {
          setLoading(false);
        }
      };
      fetchUsage();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin" />
      </div>
    );
  }

  const stats = usage?.stats || {};
  const totalInteractions = usage?.totalInteractions || 0;
  const recentInteractions = usage?.recentInteractions || 0;

    const maxCount = Math.max(...Object.values(stats).map((v) => typeof v === "number" ? v : 0), 1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/account" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-galaxy-cyan">AI Usage</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Your AI Activity</h1>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold text-white font-mono">{totalInteractions}</div>
          <div className="text-xs text-gray-400">Total Interactions</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-galaxy-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Total</span>
            <TrendingUp className="w-4 h-4 text-galaxy-cyan" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalInteractions}</div>
          <div className="text-[11px] text-gray-500">All time</div>
        </div>

        <div className="p-5 rounded-2xl bg-galaxy-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Last 30 Days</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{recentInteractions}</div>
          <div className="text-[11px] text-gray-500">Recent activity</div>
        </div>

        <div className="p-5 rounded-2xl bg-galaxy-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Tools Used</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{Object.keys(stats).length}</div>
          <div className="text-[11px] text-gray-500">Different AI tools</div>
        </div>

        <div className="p-5 rounded-2xl bg-galaxy-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Favorite</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-extrabold text-white">
            {Object.entries(stats).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0]
              ? DEMO_TITLES[Object.entries(stats).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || ""]
              : "N/A"}
          </div>
          <div className="text-[11px] text-gray-500">Most used tool</div>
        </div>
      </div>

      {/* Usage by Tool */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white">Usage by Tool</h2>
        <div className="space-y-4">
          {AI_TOOLS.map((tool) => {
            const count = stats[tool.key] || 0;
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const Icon = tool.icon;

            return (
              <Link
                key={tool.key}
                href={tool.href}
                className="flex items-center gap-4 p-4 rounded-2xl bg-galaxy-950 border border-slate-800 hover:border-cyan-500/40 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${tool.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{tool.label}</span>
                    <span className="text-xs text-gray-400">{count} uses</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-galaxy-cyan to-blue-600 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {usage?.recentChats && usage.recentChats.length > 0 && (
        <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Recent AI Chats</h2>
          <div className="space-y-3">
            {usage.recentChats.slice(0, 5).map((chat: any) => (
              <div key={chat.id} className="flex items-center justify-between p-3 rounded-xl bg-galaxy-950 border border-slate-800/60">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-gray-300">AI Chat</span>
                </div>
                <span className="text-[10px] text-gray-500">{formatDate(chat.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
