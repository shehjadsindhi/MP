import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { authRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const wishlistSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export async function GET(req: NextRequest) {
  const rateLimitResult = authRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    const items = wishlistItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      image: item.product.image,
      category: item.product.category,
      badge: item.product.badge,
      createdAt: item.createdAt,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const rateLimitResult = authRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = wishlistSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { productId } = result.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existing = await prisma.wishlistItem.findFirst({
      where: { userId: user.id, productId },
    });

    if (existing) {
      return NextResponse.json({ success: true, message: "Already in wishlist", exists: true });
    }

    const created = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId,
      },
      include: { product: true },
    });

    return NextResponse.json({
      id: created.id,
      productId: created.productId,
      name: created.product.name,
      slug: created.product.slug,
      price: created.product.price,
      originalPrice: created.product.originalPrice,
      image: created.product.image,
      category: created.product.category,
      badge: created.product.badge,
      createdAt: created.createdAt,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const rateLimitResult = authRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await prisma.wishlistItem.deleteMany({
      where: { userId: user.id, productId },
    });

    return NextResponse.json({ success: true, removed: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
  }
}
