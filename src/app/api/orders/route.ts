import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { orderRateLimit } from "@/lib/rateLimit";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendOrderConfirmationEmail } from "@/lib/email";

const TAX_RATE = 0.08;
const SHIPPING_THRESHOLD = 150;
const SHIPPING_COST = 15;

interface OrderItemInput {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}

interface CalculatedItem {
  productId: string;
  productName: string;
  productImage: string;
  selectedColor?: string | null;
  selectedStorage?: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

function calculateItemPrice(basePrice: number, selectedStorage?: string, storageOptions?: { size: string; priceOffset: number }[]): number {
  if (!selectedStorage || selectedStorage === "default" || !storageOptions) return basePrice;
  const matched = storageOptions.find((s) => s.size === selectedStorage);
  return basePrice + (matched?.priceOffset || 0);
}

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const candidate = `ORD-GALAXY-${year}-${timestamp}${random}`;

  let attempts = 0;
  while (attempts < 5) {
    const exists = await prisma.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
    await new Promise((r) => setTimeout(r, 10));
    attempts++;
  }

  return `ORD-GALAXY-${year}-${timestamp}${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  const rateLimitResult = orderRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const sessionUser = await getSessionUser().catch(() => null);
    const body = await req.json();

    const itemSchema = z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1).max(99),
      selectedColor: z.string().optional(),
      selectedStorage: z.string().optional(),
    });

    const itemsSchema = z.object({
      items: z.array(itemSchema).min(1, "Order must contain at least one item"),
      customerName: z.string().min(1, "Customer name is required"),
      customerEmail: z.string().email("Valid email is required"),
      customerPhone: z.string().optional(),
      shippingAddress: z.string().min(1, "Shipping address is required"),
      city: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
      paymentMethod: z.string().optional(),
      notes: z.string().optional(),
      promoCode: z.string().optional(),
    });

    const parseResult = itemsSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.errors[0].message }, { status: 400 });
    }

    const { items, customerName, customerEmail, customerPhone, shippingAddress, city, postalCode, country, paymentMethod, notes, promoCode } =
      parseResult.data;

    const validatedItems: CalculatedItem[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true, image: true, price: true, stock: true, storageJson: true },
      });

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.stock}` },
          { status: 400 }
        );
      }

      let storageOptions: { size: string; priceOffset: number }[] = [];
      try {
        storageOptions = product.storageJson ? JSON.parse(product.storageJson) : [];
      } catch (e) {
        console.warn("Failed to parse storageJson for product:", product.id);
      }

      const unitPrice = calculateItemPrice(product.price, item.selectedStorage, storageOptions);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        selectedColor: item.selectedColor || null,
        selectedStorage: item.selectedStorage || null,
        unitPrice,
        quantity: item.quantity,
        totalPrice,
      });
    }

    const orderNumber = await generateOrderNumber();

    let discount = 0;
    if (promoCode) {
      const offer = await prisma.offer.findUnique({
        where: { code: promoCode.toUpperCase() },
      });
      if (offer && offer.isActive && offer.validUntil > new Date()) {
        if (offer.discountPercent && offer.discountPercent > 0) {
          discount = (subtotal * offer.discountPercent) / 100;
        } else if (offer.discountAmount && offer.discountAmount > 0) {
          discount = Math.min(subtotal, offer.discountAmount);
        }
      }
    }

    const shippingCost = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * TAX_RATE;
    const total = subtotal - discount + shippingCost + tax;

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: sessionUser?.id || null,
          customerName,
          customerEmail,
          customerPhone: customerPhone || null,
          shippingAddress,
          city: city || null,
          postalCode: postalCode || null,
          country: country || "United States",
          paymentMethod: paymentMethod || "Demo Payment",
          paymentStatus: "Paid",
          orderStatus: "Processing",
          subtotal,
          discount,
          shipping: shippingCost,
          tax,
          total,
          notes: notes || "",
          items: {
            create: validatedItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              productImage: item.productImage,
              selectedColor: item.selectedColor,
              selectedStorage: item.selectedStorage,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of validatedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      if (sessionUser?.id) {
        await tx.cartItem.deleteMany({
          where: { userId: sessionUser.id },
        });
      }

      return createdOrder;
    });

    sendOrderConfirmationEmail(customerEmail, orderNumber, total).catch(() => {});

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    if (all === "true" && user.role === "ADMIN") {
      const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ orders });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
