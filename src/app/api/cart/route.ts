import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { authRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1).max(99).optional(),
  selectedColor: z.string().optional().nullable(),
  selectedStorage: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const rateLimitResult = authRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    const items = cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      image: item.product.image,
      selectedColor: item.selectedColor,
      selectedStorage: item.selectedStorage,
      quantity: item.quantity,
      stock: item.product.stock,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
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
    const result = cartItemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { productId, quantity = 1, selectedColor, selectedStorage } = result.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, slug: true, price: true, originalPrice: true, image: true, stock: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: `Insufficient stock. Available: ${product.stock}` }, { status: 400 });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: user.id,
        productId,
        selectedColor: selectedColor || null,
        selectedStorage: selectedStorage || null,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return NextResponse.json({ error: `Insufficient stock for updated quantity. Available: ${product.stock}` }, { status: 400 });
      }

      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });

      return NextResponse.json({
        id: updated.id,
        productId: updated.productId,
        name: updated.product.name,
        slug: updated.product.slug,
        price: updated.product.price,
        originalPrice: updated.product.originalPrice,
        image: updated.product.image,
        selectedColor: updated.selectedColor,
        selectedStorage: updated.selectedStorage,
        quantity: updated.quantity,
        stock: updated.product.stock,
      });
    }

    const created = await prisma.cartItem.create({
      data: {
        userId: user.id,
        productId,
        quantity,
        selectedColor: selectedColor || null,
        selectedStorage: selectedStorage || null,
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
      selectedColor: created.selectedColor,
      selectedStorage: created.selectedStorage,
      quantity: created.quantity,
      stock: created.product.stock,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const rateLimitResult = authRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, quantity, selectedColor, selectedStorage } = body;

    if (!id) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId: user.id },
      include: { product: true },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    if (quantity !== undefined) {
      if (quantity <= 0) {
        await prisma.cartItem.delete({ where: { id } });
        return NextResponse.json({ success: true, removed: true });
      }

      if (quantity > cartItem.product.stock) {
        return NextResponse.json({ error: `Insufficient stock. Available: ${cartItem.product.stock}` }, { status: 400 });
      }

      const updated = await prisma.cartItem.update({
        where: { id },
        data: { quantity },
        include: { product: true },
      });

      return NextResponse.json({
        id: updated.id,
        productId: updated.productId,
        name: updated.product.name,
        slug: updated.product.slug,
        price: updated.product.price,
        originalPrice: updated.product.originalPrice,
        image: updated.product.image,
        selectedColor: updated.selectedColor,
        selectedStorage: updated.selectedStorage,
        quantity: updated.quantity,
        stock: updated.product.stock,
      });
    }

    if (selectedColor !== undefined || selectedStorage !== undefined) {
      const updated = await prisma.cartItem.update({
        where: { id },
        data: {
          selectedColor: selectedColor ?? cartItem.selectedColor,
          selectedStorage: selectedStorage ?? cartItem.selectedStorage,
        },
        include: { product: true },
      });

      return NextResponse.json({
        id: updated.id,
        productId: updated.productId,
        name: updated.product.name,
        slug: updated.product.slug,
        price: updated.product.price,
        originalPrice: updated.product.originalPrice,
        image: updated.product.image,
        selectedColor: updated.selectedColor,
        selectedStorage: updated.selectedStorage,
        quantity: updated.quantity,
        stock: updated.product.stock,
      });
    }

    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
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
    const itemId = searchParams.get("id");
    const clearAll = searchParams.get("all");

    if (clearAll === "true") {
      await prisma.cartItem.deleteMany({ where: { userId: user.id } });
      return NextResponse.json({ success: true, cleared: true });
    }

    if (itemId) {
      await prisma.cartItem.deleteMany({ where: { id: itemId, userId: user.id } });
      return NextResponse.json({ success: true, removed: true });
    }

    return NextResponse.json({ error: "Missing id or all parameter" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 });
  }
}
