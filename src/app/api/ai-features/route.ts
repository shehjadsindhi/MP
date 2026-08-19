import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = {};
    if (category && category !== "All") {
      where.category = category;
    }

    const features = await prisma.aIFeature.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ features });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AI features" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      category,
      icon,
      badge,
      shortDesc,
      fullDesc,
      demoTab,
      supportedDevicesJson,
      benefitsJson,
      howItWorksJson,
      faqsJson,
      isFeatured,
    } = body;

    const featureSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const feature = await prisma.aIFeature.create({
      data: {
        name,
        slug: featureSlug,
        category: category || "Productivity",
        icon: icon || "Sparkles",
        badge: badge || null,
        shortDesc: shortDesc || "",
        fullDesc: fullDesc || "",
        demoTab: demoTab || "notes",
        supportedDevicesJson: typeof supportedDevicesJson === "string" ? supportedDevicesJson : JSON.stringify(supportedDevicesJson || []),
        benefitsJson: typeof benefitsJson === "string" ? benefitsJson : JSON.stringify(benefitsJson || []),
        howItWorksJson: typeof howItWorksJson === "string" ? howItWorksJson : JSON.stringify(howItWorksJson || []),
        faqsJson: typeof faqsJson === "string" ? faqsJson : JSON.stringify(faqsJson || []),
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
      },
    });

    return NextResponse.json({ success: true, feature });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create AI feature" }, { status: 500 });
  }
}
