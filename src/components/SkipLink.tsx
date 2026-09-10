"use client";

import Link from "next/link";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-galaxy-cyan focus:text-galaxy-950 focus:font-bold focus:rounded-lg"
    >
      Skip to main content
    </a>
  );
}
