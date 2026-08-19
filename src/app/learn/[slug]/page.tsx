import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, User, Sparkles, BookOpen, ArrowRight, Share2, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });
  if (!article) return { title: "Article Not Found — Galaxy AI Hub" };
  return {
    title: `${article.title} — Galaxy AI Hub`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) {
    notFound();
  }

  const relatedArticles = await prisma.article.findMany({
    where: {
      category: article.category,
      NOT: { id: article.id },
    },
    take: 2,
  });

  let tags: string[] = [];
  try {
    if (article.tagsJson) tags = JSON.parse(article.tagsJson);
  } catch (e) {}

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/learn" className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> All Guides
        </Link>
        <span>/</span>
        <span className="text-gray-500">{article.category}</span>
        <span>/</span>
        <span className="text-galaxy-cyan font-semibold truncate max-w-xs">{article.title}</span>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan font-bold uppercase">
            {article.category}
          </span>
          <span className="text-gray-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400">{formatDate(article.createdAt)}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
          {article.excerpt}
        </p>

        {/* Author Card */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-galaxy-cyan to-indigo-600 flex items-center justify-center text-galaxy-950 font-bold text-sm">
            {article.author.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{article.author}</div>
            <div className="text-xs text-gray-400">Galaxy AI Engineering & Research</div>
          </div>
        </div>
      </div>

      {/* Hero Visual */}
      <div className="rounded-3xl bg-galaxy-900 border border-slate-800 p-8 sm:p-12 flex items-center justify-center shadow-2xl h-80 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
        />
      </div>

      {/* Article Body Content */}
      <div className="prose prose-invert max-w-none space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
        <div className="whitespace-pre-line leading-loose">
          {article.content}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="pt-6 border-t border-slate-800 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-semibold mr-1">Tags:</span>
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-lg bg-galaxy-900 border border-slate-700 text-xs text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="pt-10 border-t border-slate-800 space-y-6">
          <h3 className="text-2xl font-bold text-white">Recommended Next Guides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/learn/${rel.slug}`}
                className="p-6 rounded-2xl bg-galaxy-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <span className="text-[10px] font-bold text-galaxy-cyan uppercase">
                    {rel.category}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-galaxy-cyan transition-colors mt-1">
                    {rel.title}
                  </h4>
                </div>
                <div className="text-xs text-gray-400 flex items-center justify-between">
                  <span>{rel.readTime}</span>
                  <span className="text-galaxy-cyan font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
