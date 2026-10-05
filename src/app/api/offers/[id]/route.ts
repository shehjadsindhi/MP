import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { adminMutationRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const updateOfferSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  code: z.string().optional(),
  discountPercent: z.number().int().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
  minSpend: z.number().min(0).optional(),
  validUntil: z.string().optional(),
  eligibleCategory: z.string().optional(),
  badge: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResult = adminMutationRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    await requireAdmin();
    const { id } = params;
    const body = await req.json();

    const result = updateOfferSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const data: any = {};
    if (result.data.title !== undefined) data.title = result.data.title;
    if (result.data.description !== undefined) data.description = result.data.description;
    if (result.data.code !== undefined) data.code = result.data.code.toUpperCase();
    if (result.data.discountPercent !== undefined) data.discountPercent = result.data.discountPercent;
    if (result.data.discountAmount !== undefined) data.discountAmount = result.data.discountAmount;
    if (result.data.minSpend !== undefined) data.minSpend = result.data.minSpend;
    if (result.data.validUntil !== undefined) data.validUntil = new Date(result.data.validUntil);
    if (result.data.eligibleCategory !== undefined) data.eligibleCategory = result.data.eligibleCategory;
    if (result.data.badge !== undefined) data.badge = result.data.badge;
    if (result.data.isActive !== undefined) data.isActive = result.data.isActive;

    const updated = await prisma.offer.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, offer: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update offer" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResult = adminMutationRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    await requireAdmin();
    const { id } = params;

    await prisma.offer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Offer deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete offer" }, { status: 500 });
  }
}
