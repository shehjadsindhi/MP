"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Smartphone, Sparkles, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

export default function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState<{ products: any[]; features: any[]; articles: any[] }>({
    products: [],
    features: [],
    articles: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialQuery) return;
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(initialQuery)}`);
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
    };
    fetchSearch();
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const totalMatches = results.products.length + results.features.length + results.articles.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      {/* Header & Search Bar */}
      <div className="max-w-3xl mx-auto space-y-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Search Results for &ldquo;{initialQuery || "..."}&rdquo;
        </h1>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search devices, AI features, tutorials, and guides..."
              className="w-full bg-galaxy-900 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 border-b border-slate-800 pb-4">
        {[
          { id: "all", label: `All Matches (${totalMatches})` },
          { id: "products", label: `Devices (${results.products.length})` },
          { id: "features", label: `AI Features (${results.features.length})` },
          { id: "articles", label: `Guides (${results.articles.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-galaxy-cyan text-galaxy-950 font-bold"
                : "text-gray-400 hover:text-white bg-galaxy-950 border border-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-16 text-gray-400 space-y-2">
          <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin mx-auto" />
          <p className="text-xs">Querying Galaxy AI database...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && totalMatches === 0 && (
        <div className="text-center py-20 bg-galaxy-900/40 rounded-3xl border border-slate-800 space-y-3">
          <p className="text-gray-300 text-base">No results found matching your search.</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try searching for &ldquo;S25 Ultra&rdquo;, &ldquo;Live Translate&rdquo;, &ldquo;Generative Edit&rdquo;, or &ldquo;Privacy&rdquo;.
          </p>
        </div>
      )}

      {/* Results Content */}
      {!loading && totalMatches > 0 && (
        <div className="space-y-12">
          {/* Products */}
          {(activeTab === "all" || activeTab === "products") && results.products.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-galaxy-cyan" /> Galaxy Devices ({results.products.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* AI Features */}
          {(activeTab === "all" || activeTab === "features") && results.features.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> AI Capabilities ({results.features.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.features.map((feat) => (
                  <Link
                    key={feat.id}
                    href={`/ai/features/${feat.slug}`}
                    className="p-6 rounded-2xl bg-galaxy-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-galaxy-cyan uppercase">
                        {feat.category}
                      </span>
                      <h4 className="text-base font-bold text-white group-hover:text-galaxy-cyan transition-colors mt-1">
                        {feat.name}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1.5">{feat.shortDesc}</p>
                    </div>
                    <span className="text-xs font-bold text-galaxy-cyan flex items-center gap-1">
                      Learn More <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {(activeTab === "all" || activeTab === "articles") && results.articles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" /> Learning Guides & Articles ({results.articles.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.articles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/learn/${art.slug}`}
                    className="p-6 rounded-2xl bg-galaxy-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        {art.category} • {art.readTime}
                      </span>
                      <h4 className="text-base font-bold text-white group-hover:text-galaxy-cyan transition-colors mt-1">
                        {art.title}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1.5">{art.excerpt}</p>
                    </div>
                    <span className="text-xs font-bold text-galaxy-cyan flex items-center gap-1">
                      Read Guide <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
