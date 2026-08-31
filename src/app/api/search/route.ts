import { NextRequest, NextResponse } from "next/server";
import { safeGetProducts, safeGetAIFeatures, safeGetArticles } from "@/lib/db";

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
      safeGetProducts({ search: q }),
      safeGetAIFeatures(),
      safeGetArticles(),
    ]);

    const matchingFeatures = features.filter(
      (f) =>
        f.name.toLowerCase().includes(q.toLowerCase()) ||
        f.shortDesc.toLowerCase().includes(q.toLowerCase()) ||
        f.category.toLowerCase().includes(q.toLowerCase())
    );

    const matchingArticles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(q.toLowerCase()) ||
        a.category.toLowerCase().includes(q.toLowerCase())
    );

    return NextResponse.json({
      query: q,
      totalCount: products.length + matchingFeatures.length + matchingArticles.length,
      products: products.slice(0, 6),
      features: matchingFeatures.slice(0, 6),
      articles: matchingArticles.slice(0, 6),
    });
  } catch (error) {
    return NextResponse.json({ products: [], features: [], articles: [] });
  }
}
