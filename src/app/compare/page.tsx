import React from "react";
import { prisma } from "@/lib/prisma";
import CompareClient from "./CompareClient";

export const metadata = {
  title: "Device Comparison Matrix — Galaxy AI Hub",
  description: "Compare up to 3 Galaxy devices side-by-side across processors, display nits, camera MP, battery life, and AI feature matrix.",
};

export default async function ComparePage() {
  const allProducts = await prisma.product.findMany({
    orderBy: { price: "desc" },
  });

  return <CompareClient allProducts={allProducts} />;
}
