import React, { Suspense } from "react";
import SearchClient from "./SearchClient";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Search Results — Galaxy AI Hub",
  description: "Search across Galaxy smartphones, AI capabilities, and learning articles.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-gray-400">
          <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin" />
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
