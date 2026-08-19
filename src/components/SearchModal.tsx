"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Smartphone, Sparkles, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ products: any[]; features: any[]; articles: any[] }>({
    products: [],
    features: [],
    articles: [],
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults({ products: [], features: [], articles: [] });
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], features: [], articles: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults({
            products: data.products || [],
            features: data.features || [],
            articles: data.articles || [],
          });
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const totalMatches = results.products.length + results.features.length + results.articles.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-2xl transform rounded-2xl bg-galaxy-900 border border-slate-700/80 shadow-2xl shadow-cyan-950/40 overflow-hidden transition-all">
        {/* Search Input Bar */}
        <form onSubmit={handleFullSearch} className="flex items-center border-b border-slate-800 px-4 py-3.5">
          <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Galaxy AI features, devices, articles, or guides..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-galaxy-cyan animate-spin mr-2" />}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-gray-400 hover:text-white mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs bg-slate-800 text-gray-400 px-2 py-1 rounded border border-slate-700 hover:text-white"
          >
            ESC
          </button>
        </form>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!query && (
            <div className="py-6 px-2 space-y-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Galaxy S25 Ultra",
                  "Circle to Search",
                  "Live Translate",
                  "Generative Edit",
                  "Galaxy Tab S10",
                  "Student AI Deals",
                  "Note Assist",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-lg bg-galaxy-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-gray-300 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && totalMatches === 0 && !loading && (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-gray-500 mt-1">
                Try searching for Galaxy models, AI tools, or guides.
              </p>
            </div>
          )}

          {/* Devices Section */}
          {results.products.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-galaxy-cyan uppercase tracking-wider mb-2">
                <Smartphone className="w-3.5 h-3.5" /> Galaxy Devices ({results.products.length})
              </div>
              <div className="space-y-1.5">
                {results.products.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/devices/${prod.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-galaxy-800 p-1 flex items-center justify-center flex-shrink-0">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-galaxy-cyan transition-colors">
                          {prod.name}
                        </div>
                        <div className="text-xs text-gray-400">{prod.category}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {formatPrice(prod.price)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* AI Features Section */}
          {results.features.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Capabilities ({results.features.length})
              </div>
              <div className="space-y-1.5">
                {results.features.map((feat) => (
                  <Link
                    key={feat.id}
                    href={`/ai/features/${feat.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-galaxy-cyan transition-colors">
                        {feat.name}
                      </div>
                      <div className="text-xs text-gray-400 line-clamp-1">{feat.shortDesc}</div>
                    </div>
                    <span className="text-xs text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50 flex-shrink-0 ml-2">
                      {feat.category}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Articles Section */}
          {results.articles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5" /> Learning Guides ({results.articles.length})
              </div>
              <div className="space-y-1.5">
                {results.articles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/learn/${art.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-galaxy-cyan transition-colors">
                        {art.title}
                      </div>
                      <div className="text-xs text-gray-400">{art.category} • {art.readTime}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors flex-shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {query && (
          <div className="p-3 bg-galaxy-950/90 border-t border-slate-800 flex justify-between items-center text-xs text-gray-400">
            <span>Press Enter to view all full search results</span>
            <button
              onClick={handleFullSearch}
              className="text-galaxy-cyan hover:underline flex items-center gap-1 font-semibold"
            >
              See all results <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
