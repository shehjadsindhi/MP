import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

import { safeGetOffers } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const offers = await safeGetOffers();
    return NextResponse.json({ offers });
  } catch (error) {
    const offers = await safeGetOffers();
    return NextResponse.json({ offers });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, code, discountPercent, discountAmount, minSpend, validUntil, eligibleCategory, badge, image } = body;

    const offer = await prisma.offer.create({
      data: {
        title,
        description,
        code: code.toUpperCase(),
        discountPercent: discountPercent ? parseInt(discountPercent) : 0,
        discountAmount: discountAmount ? parseFloat(discountAmount) : 0,
        minSpend: minSpend ? parseFloat(minSpend) : 0,
        validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        eligibleCategory: eligibleCategory || "All",
        badge: badge || "Limited Time",
        image: image || "/images/nova_ultra.jpg",
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create offer" }, { status: 500 });
  }
}
