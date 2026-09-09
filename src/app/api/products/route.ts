import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { adminMutationRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

import { safeGetProducts } from "@/lib/db";
import { getCached, setCached, invalidatePattern } from "@/lib/cache";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().optional(),
  category: z.string().optional(),
  price: z.number().min(0).or(z.string().transform(val => parseFloat(val))),
  originalPrice: z.number().min(0).optional(),
  discount: z.number().int().min(0).max(100).optional(),
  badge: z.string().optional().nullable(),
  description: z.string().optional(),
  image: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  specsJson: z.unknown().optional(),
  colorsJson: z.unknown().optional(),
  storageJson: z.unknown().optional(),
  aiFeaturesJson: z.unknown().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const featured = searchParams.get("featured") === "true";

    const cacheKey = `products:${category || "all"}:${search || "none"}:${sort || "none"}:${minPrice || "none"}:${maxPrice || "none"}:${featured}`;
    
    const cached = await getCached<{ products: any[] }>(cacheKey, 300);
    if (cached) {
      return NextResponse.json(cached);
    }

    const products = await safeGetProducts({
      category,
      search,
      sort,
      minPrice,
      maxPrice,
      featured,
    });

    const result = { products };
    await setCached(cacheKey, result, 300);

    return NextResponse.json(result);
  } catch (error) {
    const products = await safeGetProducts();
    return NextResponse.json({ products });
  }
}

export async function POST(req: NextRequest) {
  const rateLimitResult = adminMutationRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin required." }, { status: 403 });
    }

    const body = await req.json();
    const result = productSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const data = result.data;

    const productSlug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: productSlug,
        category: data.category || "Smartphones",
        price: typeof data.price === "string" ? parseFloat(data.price) : data.price,
        originalPrice: data.originalPrice ? (typeof data.originalPrice === "string" ? parseFloat(data.originalPrice) : data.originalPrice) : (typeof data.price === "string" ? parseFloat(data.price) : data.price),
        discount: data.discount || 0,
        badge: data.badge || null,
        description: data.description || "",
        image: data.image || "/images/nova_ultra.jpg",
        stock: data.stock ?? 50,
        specsJson: typeof data.specsJson === "string" ? data.specsJson : JSON.stringify(data.specsJson || {}),
        colorsJson: typeof data.colorsJson === "string" ? data.colorsJson : JSON.stringify(data.colorsJson || []),
        storageJson: typeof data.storageJson === "string" ? data.storageJson : JSON.stringify(data.storageJson || []),
        aiFeaturesJson: typeof data.aiFeaturesJson === "string" ? data.aiFeaturesJson : JSON.stringify(data.aiFeaturesJson || []),
      },
    });

    invalidatePattern("products:*").catch(() => {});

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
