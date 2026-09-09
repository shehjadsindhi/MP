import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { orderRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const PAYMENT_PROVIDERS = {
  demo: { name: "Demo Payment", enabled: true },
  stripe: { name: "Stripe", enabled: !!process.env.STRIPE_SECRET_KEY },
  razorpay: { name: "Razorpay", enabled: !!process.env.RAZORPAY_KEY_ID },
};

export async function GET(req: NextRequest) {
  try {
    const providers = Object.entries(PAYMENT_PROVIDERS).map(([key, config]) => ({
      id: key,
      name: config.name,
      enabled: config.enabled,
    }));

    return NextResponse.json({ providers, activeProvider: "demo" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payment providers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const rateLimitResult = orderRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, paymentMethod, provider = "demo" } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: user.id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "Paid") {
      return NextResponse.json({ error: "Order is already paid" }, { status: 400 });
    }

    if (provider === "demo") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "Paid",
          orderStatus: "Processing",
          paymentMethod: paymentMethod || "Demo Payment",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Demo payment processed successfully",
        orderId,
        provider: "demo",
      });
    }

    if (provider === "stripe" && PAYMENT_PROVIDERS.stripe.enabled) {
      return NextResponse.json({
        success: true,
        message: "Stripe payment integration ready",
        orderId,
        provider: "stripe",
        nextStep: "confirm_stripe_payment",
      });
    }

    if (provider === "razorpay" && PAYMENT_PROVIDERS.razorpay.enabled) {
      return NextResponse.json({
        success: true,
        message: "Razorpay payment integration ready",
        orderId,
        provider: "razorpay",
        nextStep: "confirm_razorpay_payment",
      });
    }

    return NextResponse.json({ error: `Payment provider '${provider}' is not configured` }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
