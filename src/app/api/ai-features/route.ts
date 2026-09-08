import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { adminMutationRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

import { safeGetAIFeatures } from "@/lib/db";

const aiFeatureSchema = z.object({
  name: z.string().min(1, "Name is required"),
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;

    const features = await safeGetAIFeatures(category);

    return NextResponse.json({ features });
  } catch (error) {
    const features = await safeGetAIFeatures();
    return NextResponse.json({ features });
  }
}

export async function POST(req: NextRequest) {
  const rateLimitResult = adminMutationRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const result = aiFeatureSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const data = result.data;
    const featureSlug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const feature = await prisma.aIFeature.create({
      data: {
        name: data.name,
        slug: featureSlug,
        category: data.category || "Productivity",
        icon: data.icon || "Sparkles",
        badge: data.badge || null,
        shortDesc: data.shortDesc || "",
        fullDesc: data.fullDesc || "",
        demoTab: data.demoTab || "notes",
        supportedDevicesJson: typeof data.supportedDevicesJson === "string" ? data.supportedDevicesJson : JSON.stringify(data.supportedDevicesJson || []),
        benefitsJson: typeof data.benefitsJson === "string" ? data.benefitsJson : JSON.stringify(data.benefitsJson || []),
        howItWorksJson: typeof data.howItWorksJson === "string" ? data.howItWorksJson : JSON.stringify(data.howItWorksJson || []),
        faqsJson: typeof data.faqsJson === "string" ? data.faqsJson : JSON.stringify(data.faqsJson || []),
        isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : true,
      },
    });

    return NextResponse.json({ success: true, feature });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create AI feature" }, { status: 500 });
  }
}
