import React from "react";
import { safeGetProducts } from "@/lib/db";
import CompareClient from "./CompareClient";

export const metadata = {
  title: "Device Comparison Matrix — Galaxy AI Hub",
  description: "Compare up to 3 Galaxy devices side-by-side across processors, display nits, camera MP, battery life, and AI feature matrix.",
};

export default async function ComparePage() {
  const allProducts = await safeGetProducts({ sort: "price-desc" });

  return <CompareClient allProducts={allProducts} />;
}
