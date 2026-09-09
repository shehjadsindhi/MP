import { NextRequest, NextResponse } from "next/server";
import { aiNotes } from "@/lib/aiProvider";
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

    const modePrompts: Record<string, string> = {
      explain: `Explain the following topic in simple ${difficulty} level terms for a student. Use clear examples and analogies:\n\n${trimmedText}`,
      notes: `Generate structured study notes from the following material with headings, bullet points, and key concepts:\n\n${trimmedText}`,
      mcq: `Generate 5 multiple-choice questions with 4 options each from the following study material. Include the correct answer:\n\n${trimmedText}`,
      short: `Generate 5 short answer questions (1-2 sentences) from the following study material:\n\n${trimmedText}`,
      long: `Generate 3 long answer/essay questions from the following study material:\n\n${trimmedText}`,
      flashcards: `Generate 10 flashcards in Q&A format from the following study material:\n\n${trimmedText}`,
      summarize: `Summarize the following study material into key points:\n\n${trimmedText}`,
      plan: `Create a study plan for mastering the following topic over 1 week with daily tasks:\n\n${trimmedText}`,
      quiz: `Create a 10-question quiz from the following study material with mix of MCQ and short answer:\n\n${trimmedText}`,
    };

    const prompt = modePrompts[mode] || modePrompts.summarize;

    try {
      const result = await aiNotes(trimmedText, "summarize");

      try {
        await prisma.aIInteraction.create({
          data: {
            userId: sessionUser?.id || null,
            demoType: "study",
            inputData: JSON.stringify({ text: trimmedText, mode, difficulty }),
            outputData: JSON.stringify({ ...result.data, mode, difficulty }),
          },
        });
      } catch (dbErr) {
        console.warn("Failed to log AI interaction:", dbErr);
      }

      return NextResponse.json({ ...result.data, mode, difficulty });
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "Study assist error" }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Study assist error" }, { status: 500 });
  }
}
