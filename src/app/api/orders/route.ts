import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    // If admin requested all orders
    if (all === "true" && user.role === "ADMIN") {
      const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ orders });
    }

    // Default: Return user's own orders
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

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      postalCode,
      country,
      paymentMethod,
      items,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      notes,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cannot create empty order" }, { status: 400 });
    }

    const orderNumber = `ORD-GALAXY-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: sessionUser ? sessionUser.id : null,
        customerName: customerName || sessionUser?.name || "Guest Customer",
        customerEmail: customerEmail || sessionUser?.email || "guest@example.com",
        customerPhone: customerPhone || sessionUser?.phone || "",
        shippingAddress: shippingAddress || "123 Galaxy Boulevard",
        city: city || "San Jose",
        postalCode: postalCode || "95110",
        country: country || "United States",
        paymentMethod: paymentMethod || "Demo Card (•••• 4242)",
        paymentStatus: "Paid",
        orderStatus: "Processing",
        subtotal: parseFloat(subtotal),
        discount: discount ? parseFloat(discount) : 0,
        shipping: shipping ? parseFloat(shipping) : 0,
        tax: tax ? parseFloat(tax) : 0,
        total: parseFloat(total),
        notes: notes || "",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            selectedColor: item.selectedColor || null,
            selectedStorage: item.selectedStorage || null,
            unitPrice: parseFloat(item.price),
            quantity: parseInt(item.quantity || 1),
            totalPrice: parseFloat(item.price) * parseInt(item.quantity || 1),
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
