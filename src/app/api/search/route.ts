import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock");
    const sort = searchParams.get("sort") || "relevance";

    if (!q && !category && !minPrice && !maxPrice) {
      return NextResponse.json({
        query: q,
        filters: { category, minPrice, maxPrice, inStock, sort },
        totalCount: 0,
        products: [],
        features: [],
        articles: [],
      });
    }

    const productWhere: any = {};
    
    if (q) {
      productWhere.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ];
    }
    
    if (category) {
      productWhere.category = { contains: category, mode: "insensitive" };
    }
    
    if (minPrice || maxPrice) {
      productWhere.price = {};
      if (minPrice) productWhere.price.gte = parseFloat(minPrice);
      if (maxPrice) productWhere.price.lte = parseFloat(maxPrice);
    }
    
    if (inStock === "true") {
      productWhere.stock = { gt: 0 };
    }

    let products = await prisma.product.findMany({
      where: productWhere,
      take: 20,
    });

    const featureWhere: any = {};
    if (q) {
      featureWhere.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { shortDesc: { contains: q, mode: "insensitive" } },
        { fullDesc: { contains: q, mode: "insensitive" } },
      ];
    }
    const features = await prisma.aIFeature.findMany({ where: featureWhere, take: 10 });

    const articleWhere: any = {};
    if (q) {
      articleWhere.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ];
    }
    if (category) {
      articleWhere.category = { contains: category, mode: "insensitive" };
    }
    const articles = await prisma.article.findMany({ where: articleWhere, take: 10 });

    if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
    else if (sort === "rating") products.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return NextResponse.json({
      query: q,
      filters: { category, minPrice, maxPrice, inStock, sort },
      totalCount: products.length + features.length + articles.length,
      products: products.slice(0, 12),
      features: features.slice(0, 6),
      articles: articles.slice(0, 6),
    });
  } catch (error) {
    return NextResponse.json({ products: [], features: [], articles: [], totalCount: 0 });
  }
}
