"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface DeviceSortSelectProps {
  selectedSort: string;
  selectedCategory: string;
}

export default function DeviceSortSelect({ selectedSort, selectedCategory }: DeviceSortSelectProps) {
  const router = useRouter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "All") {
      params.set("category", selectedCategory);
    }
    params.set("sort", e.target.value);
    router.push(`/devices?${params.toString()}`);
  };

  return (
    <select
      name="sort"
      defaultValue={selectedSort}
      onChange={handleSortChange}
      className="bg-galaxy-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-galaxy-cyan"
    >
      <option value="featured">Featured First</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Highest Rated</option>
      <option value="discount">Biggest Discount</option>
    </select>
  );
}
