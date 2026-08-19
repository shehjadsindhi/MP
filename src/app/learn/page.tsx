import React from "react";
import Link from "next/link";
import { BookOpen, Sparkles, ArrowRight, Clock, User, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Galaxy AI Learning Center & Guides — Galaxy AI Hub",
  description: "Master Galaxy AI with comprehensive step-by-step tutorials, NPU architecture whitepapers, and pro productivity tips.",
};

export default async function LearnPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const selectedCategory = searchParams?.category || "All";

  const where: any = {};
  if (selectedCategory && selectedCategory !== "All") {
    where.category = selectedCategory;
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const categories = ["All", "AI Guides", "AI Tips", "Device Guides", "Tutorials", "News"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider shadow-galaxy-cyan">
          <BookOpen className="w-3.5 h-3.5" /> Galaxy AI Knowledge Hub
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Learning Center & AI Guides
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          In-depth tutorials, privacy whitepapers, and expert tips to unlock the full potential of Galaxy AI.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <Link
              key={cat}
              href={cat === "All" ? "/learn" : `/learn?category=${cat}`}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 shadow-galaxy-cyan font-bold"
                  : "bg-galaxy-900 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((art) => (
          <Link
            key={art.id}
            href={`/learn/${art.slug}`}
            className="group rounded-3xl bg-galaxy-900/60 border border-slate-800 hover:border-cyan-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-950/20 backdrop-blur-xl"
          >
            <div className="h-52 w-full bg-galaxy-850 p-8 flex items-center justify-center overflow-hidden relative">
              <img
                src={art.image}
                alt={art.title}
                className="max-h-full max-w-full object-contain filter drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-galaxy-cyan uppercase">
                {art.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {art.readTime}
                  </span>
                  <span>•</span>
                  <span>{formatDate(art.createdAt)}</span>
                </div>

                <h2 className="text-lg font-bold text-white group-hover:text-galaxy-cyan transition-colors leading-snug">
                  {art.title}
                </h2>

                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-gray-400">
                <span className="truncate max-w-[180px]">By {art.author.split(",")[0]}</span>
                <span className="text-galaxy-cyan font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
