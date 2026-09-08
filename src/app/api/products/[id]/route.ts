import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { adminMutationRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  category: z.string().optional(),
  price: z.number().min(0).or(z.string().transform(val => parseFloat(val))).optional(),
  originalPrice: z.number().min(0).optional(),
  discount: z.number().int().min(0).max(100).optional(),
  badge: z.string().optional().nullable(),
  description: z.string().optional(),
  image: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  specsJson: z.unknown().optional(),
  colorsJson: z.unknown().optional(),
  storageJson: z.unknown().optional(),
  aiFeaturesJson: z.unknown().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResult = adminMutationRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const result = productUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const data = result.data;

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.price !== undefined) updateData.price = typeof data.price === "string" ? parseFloat(data.price) : data.price;
    if (data.originalPrice !== undefined) updateData.originalPrice = typeof data.originalPrice === "string" ? parseFloat(data.originalPrice) : data.originalPrice;
    if (data.discount !== undefined) updateData.discount = data.discount;
    if (data.badge !== undefined) updateData.badge = data.badge;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.specsJson !== undefined) updateData.specsJson = typeof data.specsJson === "string" ? data.specsJson : JSON.stringify(data.specsJson);
    if (data.colorsJson !== undefined) updateData.colorsJson = typeof data.colorsJson === "string" ? data.colorsJson : JSON.stringify(data.colorsJson);
    if (data.storageJson !== undefined) updateData.storageJson = typeof data.storageJson === "string" ? data.storageJson : JSON.stringify(data.storageJson);
    if (data.aiFeaturesJson !== undefined) updateData.aiFeaturesJson = typeof data.aiFeaturesJson === "string" ? data.aiFeaturesJson : JSON.stringify(data.aiFeaturesJson);

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResult = adminMutationRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
