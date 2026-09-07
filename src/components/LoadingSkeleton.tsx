"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-slate-800/80 border border-slate-700/50",
        "before:absolute before:inset-0",
        "before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r",
        "before:from-transparent before:via-cyan-500/8 before:to-transparent",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-slate-800/60 to-slate-900/60" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl bg-galaxy-900/60 border border-slate-800/80 flex flex-col overflow-hidden">
      <Skeleton className="aspect-square w-full h-60 rounded-b-none" />
      <div className="p-5 flex-1 flex flex-col gap-3">
        <Skeleton className="h-3.5 w-3/4 rounded" />
        <Skeleton className="h-5 w-1/2 rounded" />
        <Skeleton className="h-3 w-full rounded mt-auto" />
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-3 flex-1 rounded" />
          <Skeleton className="h-3 w-1/3 rounded" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <Skeleton className="h-6 w-1/4 rounded" />
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="rounded-2xl bg-galaxy-900/60 border border-slate-800/60 p-5 flex flex-col gap-3">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <Skeleton className="h-3.5 w-3/4 rounded" />
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-5/6 rounded" />
      <div className="flex gap-2 mt-auto">
        <Skeleton className="h-2.5 w-12 rounded" />
        <Skeleton className="h-2.5 w-16 rounded" />
      </div>
    </div>
  );
}

export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3 rounded",
            i === lines - 1 ? "w-2/3" : "w-full",
            "bg-slate-800/70"
          )}
        />
      ))}
    </div>
  );
}
