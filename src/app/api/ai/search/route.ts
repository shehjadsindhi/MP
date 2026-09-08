import { NextRequest, NextResponse } from "next/server";
import { searchGalaxyAI } from "@/lib/mockAI";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { aiApiRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const rateLimitResult = aiApiRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const query = (body.query || "").trim();

    if (!query) {
      return NextResponse.json({ error: "Query is required." }, { status: 400 });
    }
    if (query.length > 500) {
      return NextResponse.json({ error: "Query exceeds 500 character limit." }, { status: 400 });
    }

    const sessionUser = await getSessionUser().catch(() => null);
    const result = await searchGalaxyAI(query);

    try {
      await prisma.aIInteraction.create({
        data: {
          userId: sessionUser?.id || null,
          demoType: "search",
          inputData: query,
          outputData: JSON.stringify(result),
        },
      });
    } catch (dbErr) {
      console.warn("Failed to log AI interaction:", dbErr);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Search AI error" }, { status: 500 });
  }
}
