import React from "react";
import { notFound } from "next/navigation";
import { safeGetProductByIdOrSlug, safeGetProducts } from "@/lib/db";
import DeviceDetailClient from "./DeviceDetailClient";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await safeGetProductByIdOrSlug(params.id);
  if (!product) return { title: "Device Not Found — Galaxy AI Hub" };
  return {
    title: `${product.name} — Galaxy AI Hub`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await safeGetProductByIdOrSlug(params.id);

  if (!product) {
    notFound();
  }

  const allProducts = await safeGetProducts({ category: product.category });
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return <DeviceDetailClient product={product} relatedProducts={relatedProducts} />;
}
