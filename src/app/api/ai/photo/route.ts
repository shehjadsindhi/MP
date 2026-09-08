import { NextRequest, NextResponse } from "next/server";
import { processPhotoEdit } from "@/lib/mockAI";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { aiApiRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const rateLimitResult = aiApiRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const action = body.action || "enhanceImage";

    const sessionUser = await getSessionUser().catch(() => null);
    const result = await processPhotoEdit(action);

    try {
      await prisma.aIInteraction.create({
        data: {
          userId: sessionUser?.id || null,
          demoType: "photo",
          inputData: action || "enhanceImage",
          outputData: JSON.stringify(result),
        },
      });
    } catch (dbErr) {
      console.warn("Failed to log AI interaction:", dbErr);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Photo edit error" }, { status: 500 });
  }
}
