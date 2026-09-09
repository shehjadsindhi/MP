import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, category: true, price: true },
    });

    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const [relatedProducts, priceRangeProducts] = await Promise.all([
      prisma.product.findMany({
        where: {
          category: currentProduct.category,
          id: { not: productId },
          isFeatured: true,
        },
        take: 4,
        orderBy: { rating: "desc" },
      }),
      prisma.product.findMany({
        where: {
          id: { not: productId },
          price: {
            gte: currentProduct.price * 0.8,
            lte: currentProduct.price * 1.2,
          },
        },
        take: 4,
        orderBy: { rating: "desc" },
      }),
    ]);

    const seen = new Set<string>();
    const recommendations: any[] = [];

    for (const p of relatedProducts) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        recommendations.push({ ...p, reason: "Same category" });
      }
    }

    for (const p of priceRangeProducts) {
      if (!seen.has(p.id) && recommendations.length < 8) {
        seen.add(p.id);
        recommendations.push({ ...p, reason: "Similar price range" });
      }
    }

    return NextResponse.json({ recommendations });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
