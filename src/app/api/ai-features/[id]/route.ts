import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

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
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const updated = await prisma.aIFeature.update({
      where: { id },
      data: {
        name: body.name,
        category: body.category,
        icon: body.icon,
        badge: body.badge || null,
        shortDesc: body.shortDesc,
        fullDesc: body.fullDesc,
        demoTab: body.demoTab,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : true,
        supportedDevicesJson: typeof body.supportedDevicesJson === "string" ? body.supportedDevicesJson : JSON.stringify(body.supportedDevicesJson || []),
        benefitsJson: typeof body.benefitsJson === "string" ? body.benefitsJson : JSON.stringify(body.benefitsJson || []),
        howItWorksJson: typeof body.howItWorksJson === "string" ? body.howItWorksJson : JSON.stringify(body.howItWorksJson || []),
        faqsJson: typeof body.faqsJson === "string" ? body.faqsJson : JSON.stringify(body.faqsJson || []),
      },
    });

    return NextResponse.json({ success: true, feature: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update AI feature" }, { status: 500 });
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
    await prisma.aIFeature.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "AI Feature deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete AI feature" }, { status: 500 });
  }
}
