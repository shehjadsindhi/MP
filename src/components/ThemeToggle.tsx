"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-galaxy-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-gray-300 hover:text-white transition-all flex items-center gap-2 shadow-sm"
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-4 h-4 text-galaxy-cyan" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-400" />
      )}
      <span className="text-xs text-gray-400 hidden xl:inline">
        {resolvedTheme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
