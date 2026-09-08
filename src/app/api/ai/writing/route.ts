import { NextRequest, NextResponse } from "next/server";
import { aiRewrite } from "@/lib/aiProvider";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { aiApiRateLimit } from "@/lib/rateLimit";

const VALID_TONES = ["Professional", "Casual", "Persuasive", "Concise", "Academic", "Social Media"];

export async function POST(req: NextRequest) {
  const rateLimitResult = aiApiRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const { text, tone } = body;
    const trimmedText = (text || "").trim();
    const selectedTone = tone || "Professional";

    if (!trimmedText) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }
    if (trimmedText.length > 5000) {
      return NextResponse.json({ error: "Text exceeds 5000 character limit." }, { status: 400 });
    }
    if (!VALID_TONES.includes(selectedTone)) {
      return NextResponse.json({ error: "Invalid tone selected." }, { status: 400 });
    }

    const sessionUser = await getSessionUser().catch(() => null);
    const result = await aiRewrite(trimmedText, selectedTone);

    try {
      await prisma.aIInteraction.create({
        data: {
          userId: sessionUser?.id || null,
          demoType: "writing",
          inputData: JSON.stringify({ text: trimmedText, tone: selectedTone }),
          outputData: JSON.stringify(result.data),
        },
      });
    } catch (dbErr) {
      console.warn("Failed to log AI interaction:", dbErr);
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Writing assist error" }, { status: 500 });
  }
}
