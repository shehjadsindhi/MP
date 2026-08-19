import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q) {
      return NextResponse.json({
        products: [],
        features: [],
        articles: [],
      });
    }

    const [products, features, articles] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { category: { contains: q } },
          ],
        },
        take: 6,
      }),
      prisma.aIFeature.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { shortDesc: { contains: q } },
            { category: { contains: q } },
          ],
        },
        take: 6,
      }),
      prisma.article.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { excerpt: { contains: q } },
            { category: { contains: q } },
          ],
        },
        take: 6,
      }),
    ]);

    return NextResponse.json({
      query: q,
      totalCount: products.length + features.length + articles.length,
      products,
      features,
      articles,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
