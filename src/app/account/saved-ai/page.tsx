"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Clock, MessageCircle, Search, FileText, Image as ImageIcon, Edit3, Loader2, Trash2, X, Filter } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

const DEMO_ICONS: Record<string, React.ReactNode> = {
  chat: <MessageCircle className="w-4 h-4" />,
  translate: <Sparkles className="w-4 h-4" />,
  rewrite: <Edit3 className="w-4 h-4" />,
  notes: <FileText className="w-4 h-4" />,
  search: <Search className="w-4 h-4" />,
  photo: <ImageIcon className="w-4 h-4" />,
  study: <FileText className="w-4 h-4" />,
  "device-finder": <Search className="w-4 h-4" />,
  "shopping-assistant": <Sparkles className="w-4 h-4" />,
};

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

function truncate(text: string, max: number): string {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

export default function SavedAIPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { showToast } = useToast();
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<Record<string, number>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const fetchHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const params = new URLSearchParams();
      if (filterType !== "all") params.set("demoType", filterType);
      if (searchQuery) params.set("search", searchQuery);
      params.set("limit", "200");

      const res = await fetch(`/api/user/ai-history?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInteractions(data.interactions || []);
        setStats(data.stats || {});
      }
    } catch (e) {
      showToast("Failed to load AI history", "error");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user, filterType]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch("/api/user/ai-history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setInteractions((prev) => prev.filter((i) => i.id !== id));
        showToast("Interaction deleted", "success");
      } else {
        showToast("Failed to delete", "error");
      }
    } catch (e) {
      showToast("Network error", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch("/api/user/ai-history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true, demoType: filterType === "all" ? undefined : filterType }),
      });

      if (res.ok) {
        const data = await res.json();
        setInteractions([]);
        setStats({});
        setShowClearConfirm(false);
        showToast(`Cleared ${data.deleted} interactions`, "success");
      } else {
        showToast("Failed to clear history", "error");
      }
    } catch (e) {
      showToast("Network error", "error");
    }
  };

  const filteredInteractions = searchQuery
    ? interactions.filter((i) => {
        try {
          const input = typeof i.inputData === "string" ? i.inputData : JSON.stringify(i.inputData);
          const output = typeof i.outputData === "string" ? i.outputData : JSON.stringify(i.outputData);
          return input.toLowerCase().includes(searchQuery.toLowerCase()) || output.toLowerCase().includes(searchQuery.toLowerCase());
        } catch {
          return false;
        }
      })
    : interactions;

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
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

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            Showing <strong className="text-white">{filteredInteractions.length}</strong> interactions
          </span>
          {interactions.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold hover:bg-rose-500/20 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your AI history..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-galaxy-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {["all", ...Object.keys(DEMO_TITLES)].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === type
                  ? "bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950"
                  : "bg-galaxy-900 border border-slate-800 text-gray-300 hover:text-white"
              }`}
            >
              {type === "all" ? "All" : DEMO_TITLES[type] || type}
              {stats[type] ? ` (${stats[type]})` : ""}
            </button>
          ))}
        </div>
      </div>

      {loadingHistory ? (
        <div className="text-center py-20 text-gray-400 space-y-2">
          <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin mx-auto" />
          <p className="text-xs">Loading your Galaxy AI history...</p>
        </div>
      ) : filteredInteractions.length === 0 ? (
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
          {(() => {
            const grouped = filteredInteractions.reduce((acc: Record<string, any[]>, cur: any) => {
              const key = cur.demoType || "other";
              if (!acc[key]) acc[key] = [];
              acc[key].push(cur);
              return acc;
            }, {});

            return Object.keys(grouped)
              .sort((a, b) => (grouped[b][0]?.createdAt || "").localeCompare(grouped[a][0]?.createdAt || ""))
              .map((demoType) => {
                const items = grouped[demoType];
                return (
                  <div
                    key={demoType}
                    className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-4 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        {DEMO_ICONS[demoType] || <Sparkles className="w-4 h-4" />}
                        <h3 className="text-lg font-bold text-white">
                          {DEMO_TITLES[demoType] || demoType.charAt(0).toUpperCase() + demoType.slice(1)}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {items.length} interaction{items.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <button
                        onClick={() => handleClearAll}
                        className="text-[10px] px-2 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold hover:bg-rose-500/20 transition-colors"
                      >
                        Clear
                      </button>
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
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(item.createdAt)}</span>
                              </div>
                              <button
                                onClick={() => handleDelete(item.id)}
                                disabled={deletingId === item.id}
                                className="p-1.5 rounded-lg hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 transition-colors"
                                title="Delete"
                              >
                                {deletingId === item.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
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
              });
          })()}
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-galaxy-950 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Clear AI History</h3>
            <p className="text-xs text-gray-400">
              Are you sure you want to delete all your AI interaction history? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
