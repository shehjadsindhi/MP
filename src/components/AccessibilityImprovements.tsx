"use client";

import { SkipLink } from "@/components/SkipLink";
import { useEffect } from "react";

export default function AccessibilityImprovements() {
  useEffect(() => {
    document.documentElement.setAttribute("lang", "en");
    document.documentElement.style.setProperty("scroll-behavior", "smooth");

    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.tagName === "BUTTON") {
        target.setAttribute("aria-label", target.getAttribute("aria-label") || target.textContent?.trim() || "Button");
      }
    };

    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, []);

  return <SkipLink />;
}
