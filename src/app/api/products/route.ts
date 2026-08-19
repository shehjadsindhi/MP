import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const featured = searchParams.get("featured");

    const where: any = {};

    if (category && category !== "All") {
      where.category = category;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "rating") orderBy = { rating: "desc" };
    if (sort === "discount") orderBy = { discount: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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
