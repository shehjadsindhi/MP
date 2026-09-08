"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Clock, MessageCircle, Search, FileText, Image as ImageIcon, Edit3, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";

const DEMO_ICONS: Record<string, React.ReactNode> = {
  chat: <MessageCircle className="w-4 h-4" />,
  translate: <Sparkles className="w-4 h-4" />,
  rewrite: <Edit3 className="w-4 h-4" />,
  notes: <FileText className="w-4 h-4" />,
  search: <Search className="w-4 h-4" />,
  photo: <ImageIcon className="w-4 h-4" />,
};

const DEMO_TITLES: Record<string, string> = {
  chat: "Chat",
  translate: "Translate",
  rewrite: "Rewrite",
  notes: "Notes Assist",
  search: "AI Search",
  photo: "Photo Edit",
};

function truncate(text: string, max: number): string {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

export default function SavedAIPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          const res = await fetch("/api/user/ai-history");
          if (res.ok) {
            const data = await res.json();
            setInteractions(data.interactions || []);
          }
        } catch (e) {
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin" />
      </div>
    );
  }

  const grouped = interactions.reduce((acc: Record<string, any[]>, cur: any) => {
    const key = cur.demoType || "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(cur);
    return acc;
  }, {});

  const demoTypes = Object.keys(grouped).sort(
    (a, b) => (grouped[b][0]?.createdAt || "").localeCompare(grouped[a][0]?.createdAt || "")
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/account" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-galaxy-cyan">Saved AI Interactions</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Your Saved AI History</h1>
        </div>

        <span className="text-xs text-gray-400">
          Showing <strong className="text-white">{interactions.length}</strong> interactions
        </span>
      </div>

      {loadingHistory ? (
        <div className="text-center py-20 text-gray-400 space-y-2">
          <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin mx-auto" />
          <p className="text-xs">Loading your Galaxy AI history...</p>
        </div>
      ) : interactions.length === 0 ? (
        <div className="text-center py-20 bg-galaxy-900/40 rounded-3xl border border-slate-800 space-y-4">
          <Sparkles className="w-12 h-12 text-gray-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">No saved AI interactions</h2>
          <p className="text-xs text-gray-400">You have not used any Galaxy AI features yet.</p>
          <Link
            href="/ai"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-galaxy-cyan text-galaxy-950 font-bold text-xs"
          >
            Try Galaxy AI <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {demoTypes.map((demoType) => {
            const items = grouped[demoType];
            return (
              <div
                key={demoType}
                className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  {DEMO_ICONS[demoType] || <Sparkles className="w-4 h-4" />}
                  <h3 className="text-lg font-bold text-white">
                    {DEMO_TITLES[demoType] || demoType.charAt(0).toUpperCase() + demoType.slice(1)}
                  </h3>
                  <span className="text-xs text-gray-500 ml-auto">
                    {items.length} interaction{items.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-4">
                  {items.map((item) => {
                    let inputText = "";
                    let outputText = "";
                    try {
                      inputText = typeof item.inputData === "string" ? item.inputData : JSON.stringify(item.inputData);
                    } catch (e) {
                      inputText = String(item.inputData);
                    }
                    try {
                      outputText = typeof item.outputData === "string" ? item.outputData : JSON.stringify(item.outputData);
                    } catch (e) {
                      outputText = String(item.outputData);
                    }

                    return (
                      <div key={item.id} className="space-y-2 p-3 rounded-xl bg-galaxy-950 border border-slate-800/60">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>

                        {inputText && (
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-400">Input:</span>
                            <p className="text-xs text-gray-300 whitespace-pre-wrap break-all">
                              {truncate(inputText, 300)}
                            </p>
                          </div>
                        )}

                        {outputText && (
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-400">Output:</span>
                            <p className="text-xs text-gray-300 whitespace-pre-wrap break-all">
                              {truncate(outputText, 500)}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
