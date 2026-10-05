import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const validateOfferSchema = z.object({
  code: z.string().min(1, "Promo code is required"),
  subtotal: z.number().min(0).optional(),
  category: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = validateOfferSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { code, subtotal = 0, category } = result.data;
    const cleanCode = code.trim().toUpperCase();

    const offer = await prisma.offer.findUnique({
      where: { code: cleanCode },
    });

    if (!offer) {
      return NextResponse.json({ error: `Promo code "${cleanCode}" is invalid.` }, { status: 400 });
    }

    if (!offer.isActive) {
      return NextResponse.json({ error: "This promo code is no longer active." }, { status: 400 });
    }

    if (new Date(offer.validUntil) < new Date()) {
      return NextResponse.json({ error: "This promo code has expired." }, { status: 400 });
    }

    if (offer.minSpend > 0 && subtotal > 0 && subtotal < offer.minSpend) {
      return NextResponse.json(
        { error: `Minimum order spend of $${offer.minSpend} required to use this code.` },
        { status: 400 }
      );
    }

    let calculatedDiscount = 0;
    if (offer.discountPercent && offer.discountPercent > 0) {
      calculatedDiscount = (subtotal * offer.discountPercent) / 100;
    } else if (offer.discountAmount && offer.discountAmount > 0) {
      calculatedDiscount = Math.min(subtotal, offer.discountAmount);
    }

    return NextResponse.json({
      success: true,
      code: offer.code,
      title: offer.title,
      description: offer.description,
      discountPercent: offer.discountPercent,
      discountAmount: offer.discountAmount,
      calculatedDiscount,
      badge: offer.badge,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 });
  }
}
