import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

import { safeGetProducts } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const featured = searchParams.get("featured") === "true";

    const products = await safeGetProducts({
      category,
      search,
      sort,
      minPrice,
      maxPrice,
      featured,
    });

    return NextResponse.json({ products });
  } catch (error) {
    const products = await safeGetProducts();
    return NextResponse.json({ products });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      category,
      price,
      originalPrice,
      discount,
      badge,
      description,
      image,
      stock,
      specsJson,
      colorsJson,
      storageJson,
      aiFeaturesJson,
    } = body;

    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const product = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        category: category || "Smartphones",
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
        discount: discount ? parseInt(discount) : 0,
        badge: badge || null,
        description: description || "",
        image: image || "/images/nova_ultra.jpg",
        stock: stock ? parseInt(stock) : 50,
        specsJson: typeof specsJson === "string" ? specsJson : JSON.stringify(specsJson || {}),
        colorsJson: typeof colorsJson === "string" ? colorsJson : JSON.stringify(colorsJson || []),
        storageJson: typeof storageJson === "string" ? storageJson : JSON.stringify(storageJson || []),
        aiFeaturesJson: typeof aiFeaturesJson === "string" ? aiFeaturesJson : JSON.stringify(aiFeaturesJson || []),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
