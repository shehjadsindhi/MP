import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { aiApiRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const deviceFinderSchema = z.object({
  query: z.string().min(3, "Please describe your requirements in at least 3 characters"),
});

function extractBudget(text: string): number | undefined {
  const patterns = [
    /under\s+[₹$]?\s*([\d,]+)/i,
    /below\s+[₹$]?\s*([\d,]+)/i,
    /within\s+[₹$]?\s*([\d,]+)/i,
    /budget\s+[₹$]?\s*([\d,]+)/i,
    /max\s+[₹$]?\s*([\d,]+)/i,
    /₹\s*([\d,]+)/i,
    /\$\s*([\d,]+)/i,
    /([\d,]+)\s*(?:rupees|rs|dollars|usd)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const parsed = parseInt(match[1].replace(/,/g, ""));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  return undefined;
}

function extractUseCase(text: string): string[] {
  const lower = text.toLowerCase();
  const useCases: string[] = [];

  if (lower.includes("gaming") || lower.includes("game")) useCases.push("Gaming");
  if (lower.includes("camera") || lower.includes("photo") || lower.includes("photography")) useCases.push("Camera");
  if (lower.includes("student") || lower.includes("study") || lower.includes("college") || lower.includes("school")) useCases.push("Student");
  if (lower.includes("professional") || lower.includes("work") || lower.includes("business")) useCases.push("Professional");
  if (lower.includes("fold") || lower.includes("tablet")) useCases.push("Foldable");
  if (lower.includes("watch") || lower.includes("wearable")) useCases.push("Wearable");
  if (lower.includes("audio") || lower.includes("headphone") || lower.includes("earbuds")) useCases.push("Audio");

  return useCases;
}

export async function POST(req: NextRequest) {
  const rateLimitResult = aiApiRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const result = deviceFinderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const query = result.data.query.trim();
    const budget = extractBudget(query);
    const useCases = extractUseCase(query);

    let where: any = {};
    if (budget) {
      where.price = { lte: budget };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: budget ? { price: "asc" } : { rating: "desc" },
      take: 6,
    });

    const ranked = products.map((product) => {
      let score = 0;
      let reasons: string[] = [];

      if (budget && product.price <= budget) {
        score += 20;
        reasons.push("Within your budget");
      }

      if (useCases.length > 0) {
        const productText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
        const matchedUseCases = useCases.filter((uc) => productText.includes(uc.toLowerCase()));
        score += matchedUseCases.length * 15;
        if (matchedUseCases.length > 0) {
          reasons.push(`Matches: ${matchedUseCases.join(", ")}`);
        }
      }

      if (product.isFeatured) {
        score += 10;
        reasons.push("Featured device");
      }

      if (product.rating >= 4.7) {
        score += 10;
        reasons.push("Highly rated");
      }

      if (product.stock > 0) {
        score += 5;
        reasons.push("In stock");
      }

      let aiFeatures: string[] = [];
      try {
        aiFeatures = product.aiFeaturesJson ? JSON.parse(product.aiFeaturesJson) : [];
      } catch (e) {}

      if (aiFeatures.length > 0) {
        score += 10;
        reasons.push(`${aiFeatures.length} AI features`);
      }

      return {
        ...product,
        matchScore: score,
        reasons: reasons.length > 0 ? reasons : ["Available in our catalog"],
      };
    });

    ranked.sort((a, b) => b.matchScore - a.matchScore);

    const sessionUser = await getSessionUser().catch(() => null);

    try {
      await prisma.aIInteraction.create({
        data: {
          userId: sessionUser?.id || null,
          demoType: "device-finder",
          inputData: query,
          outputData: JSON.stringify({ products: ranked.map((p) => ({ id: p.id, name: p.name, price: p.price, matchScore: p.matchScore })) }),
        },
      });
    } catch (dbErr) {
      console.warn("Failed to log AI interaction:", dbErr);
    }

    return NextResponse.json({
      query,
      extractedBudget: budget,
      extractedUseCases: useCases,
      products: ranked,
      totalMatches: ranked.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Device finder error" }, { status: 500 });
  }
}
