"use client";

import React, { useState, useEffect } from "react";

export function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const articleTop = article.getBoundingClientRect().top;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;

      if (articleTop <= 0 && articleTop > -articleHeight + windowHeight) {
        const scrolled = Math.abs(articleTop);
        const total = articleHeight - windowHeight;
        const percentage = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
        setProgress(percentage);
        setIsReading(true);
      } else if (articleTop > 0) {
        setProgress(0);
        setIsReading(false);
      } else if (articleTop <= -articleHeight + windowHeight) {
        setProgress(100);
        setIsReading(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { progress, isReading };
}

export function ReadingProgressBar() {
  const { progress } = useReadingProgress();

  if (progress <= 0 || progress >= 100) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
      <div
        className="h-full bg-gradient-to-r from-galaxy-cyan to-blue-600 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
