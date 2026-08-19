import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DeviceDetailClient from "./DeviceDetailClient";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
  });
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
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      NOT: { id: product.id },
    },
    take: 4,
  });

  return <DeviceDetailClient product={product} relatedProducts={relatedProducts} />;
}
