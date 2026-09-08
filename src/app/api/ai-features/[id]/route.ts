import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { adminMutationRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const aiFeatureUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  category: z.string().optional(),
  icon: z.string().optional(),
  badge: z.string().optional().nullable(),
  shortDesc: z.string().optional(),
  fullDesc: z.string().optional(),
  demoTab: z.string().optional(),
  supportedDevicesJson: z.unknown().optional(),
  benefitsJson: z.unknown().optional(),
  howItWorksJson: z.unknown().optional(),
  faqsJson: z.unknown().optional(),
  isFeatured: z.boolean().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const feature = await prisma.aIFeature.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!feature) {
      return NextResponse.json({ error: "AI Feature not found" }, { status: 404 });
    }

    return NextResponse.json({ feature });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AI feature" }, { status: 500 });
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
    const result = aiFeatureUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const data = result.data;

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.badge !== undefined) updateData.badge = data.badge;
    if (data.shortDesc !== undefined) updateData.shortDesc = data.shortDesc;
    if (data.fullDesc !== undefined) updateData.fullDesc = data.fullDesc;
    if (data.demoTab !== undefined) updateData.demoTab = data.demoTab;
    if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);
    if (data.supportedDevicesJson !== undefined) updateData.supportedDevicesJson = typeof data.supportedDevicesJson === "string" ? data.supportedDevicesJson : JSON.stringify(data.supportedDevicesJson);
    if (data.benefitsJson !== undefined) updateData.benefitsJson = typeof data.benefitsJson === "string" ? data.benefitsJson : JSON.stringify(data.benefitsJson);
    if (data.howItWorksJson !== undefined) updateData.howItWorksJson = typeof data.howItWorksJson === "string" ? data.howItWorksJson : JSON.stringify(data.howItWorksJson);
    if (data.faqsJson !== undefined) updateData.faqsJson = typeof data.faqsJson === "string" ? data.faqsJson : JSON.stringify(data.faqsJson);

    const updated = await prisma.aIFeature.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, feature: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update AI feature" }, { status: 500 });
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
    await prisma.aIFeature.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "AI Feature deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete AI feature" }, { status: 500 });
  }
}
