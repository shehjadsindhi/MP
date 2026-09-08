import { NextRequest, NextResponse } from "next/server";
import { aiTranslate } from "@/lib/aiProvider";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { aiApiRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const rateLimitResult = aiApiRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const { text, sourceLang, targetLang } = body;
    const trimmedText = (text || "").trim();

    if (!trimmedText) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }
    if (trimmedText.length > 5000) {
      return NextResponse.json({ error: "Text exceeds 5000 character limit." }, { status: 400 });
    }
    if (!sourceLang || !targetLang) {
      return NextResponse.json({ error: "Source and target languages are required." }, { status: 400 });
    }

    const sessionUser = await getSessionUser().catch(() => null);
    const result = await aiTranslate(trimmedText, sourceLang, targetLang);

    try {
      await prisma.aIInteraction.create({
        data: {
          userId: sessionUser?.id || null,
          demoType: "translation",
          inputData: JSON.stringify({ text: trimmedText, sourceLang, targetLang }),
          outputData: JSON.stringify(result.data),
        },
      });
    } catch (dbErr) {
      console.warn("Failed to log AI interaction:", dbErr);
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Translation error" }, { status: 500 });
  }
}
