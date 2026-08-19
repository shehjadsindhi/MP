import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

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
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        category: body.category,
        price: parseFloat(body.price),
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : parseFloat(body.price),
        discount: body.discount !== undefined ? parseInt(body.discount) : 0,
        badge: body.badge || null,
        description: body.description,
        image: body.image,
        stock: body.stock !== undefined ? parseInt(body.stock) : 50,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : false,
        specsJson: typeof body.specsJson === "string" ? body.specsJson : JSON.stringify(body.specsJson || {}),
        colorsJson: typeof body.colorsJson === "string" ? body.colorsJson : JSON.stringify(body.colorsJson || []),
        storageJson: typeof body.storageJson === "string" ? body.storageJson : JSON.stringify(body.storageJson || []),
        aiFeaturesJson: typeof body.aiFeaturesJson === "string" ? body.aiFeaturesJson : JSON.stringify(body.aiFeaturesJson || []),
      },
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
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}
