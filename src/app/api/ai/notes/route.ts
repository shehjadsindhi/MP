import { NextRequest, NextResponse } from "next/server";
import { aiNotes } from "@/lib/aiProvider";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { aiApiRateLimit } from "@/lib/rateLimit";

const VALID_ACTIONS = ["summarize", "tasks", "expand", "keyPoints", "transcript"];

export async function POST(req: NextRequest) {
  const rateLimitResult = aiApiRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const { text, action } = body;
    const trimmedText = (text || "").trim();
    const selectedAction = action || "summarize";

    if (!trimmedText) {
      return NextResponse.json({ error: "Notes text is required." }, { status: 400 });
    }
    if (trimmedText.length > 10000) {
      return NextResponse.json({ error: "Text exceeds 10000 character limit." }, { status: 400 });
    }
    if (!VALID_ACTIONS.includes(selectedAction)) {
      return NextResponse.json({ error: "Invalid action selected." }, { status: 400 });
    }

    const sessionUser = await getSessionUser().catch(() => null);
    const result = await aiNotes(trimmedText, selectedAction);

    try {
      await prisma.aIInteraction.create({
        data: {
          userId: sessionUser?.id || null,
          demoType: "notes",
          inputData: JSON.stringify({ text: trimmedText, action: selectedAction }),
          outputData: JSON.stringify(result.data),
        },
      });
    } catch (dbErr) {
      console.warn("Failed to log AI interaction:", dbErr);
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Note assist error" }, { status: 500 });
  }
}
