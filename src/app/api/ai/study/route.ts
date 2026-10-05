import { NextRequest, NextResponse } from "next/server";
import { aiStudy } from "@/lib/aiProvider";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { aiApiRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const studySchema = z.object({
  text: z.string().min(1, "Study material is required"),
  mode: z.enum(["explain", "notes", "mcq", "short", "long", "flashcards", "summarize", "plan", "quiz"]),
  difficulty: z.enum(["easy", "medium", "advanced"]).optional(),
});

export async function POST(req: NextRequest) {
  const rateLimitResult = aiApiRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const result = studySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { text, mode, difficulty = "medium" } = result.data;
    const trimmedText = (text || "").trim();

    if (!trimmedText) {
      return NextResponse.json({ error: "Study material is required." }, { status: 400 });
    }
    if (trimmedText.length > 10000) {
      return NextResponse.json({ error: "Text exceeds 10000 character limit." }, { status: 400 });
    }

    const sessionUser = await getSessionUser().catch(() => null);

    const studyResult = await aiStudy(trimmedText, mode, difficulty);

    try {
      await prisma.aIInteraction.create({
        data: {
          userId: sessionUser?.id || null,
          demoType: "study",
          inputData: JSON.stringify({ text: trimmedText, mode, difficulty }),
          outputData: JSON.stringify(studyResult.data),
        },
      });
    } catch (dbErr) {
      console.warn("Failed to log AI interaction:", dbErr);
    }

    return NextResponse.json({
      success: true,
      ...studyResult.data,
      engine: studyResult.engine,
      provider: studyResult.provider,
      usedFallback: studyResult.usedFallback,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Study assist error" }, { status: 500 });
  }
}
