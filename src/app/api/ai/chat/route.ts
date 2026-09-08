import { NextRequest, NextResponse } from "next/server";
import { aiChat } from "@/lib/aiProvider";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { aiApiRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const rateLimitResult = aiApiRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const message = (body.message || "").trim();
    const history = body.history || [];

    if (!message || message.length > 2000) {
      return NextResponse.json(
        { error: message ? "Message exceeds 2000 character limit." : "Message is required." },
        { status: 400 }
      );
    }

    const sessionUser = await getSessionUser().catch(() => null);
    const result = await aiChat(message, history);

    try {
      await prisma.aIInteraction.create({
        data: {
          userId: sessionUser?.id || null,
          demoType: "chat",
          inputData: message,
          outputData: JSON.stringify(result.data),
        },
      });
    } catch (dbErr) {
      console.warn("Failed to log AI interaction:", dbErr);
    }

    return NextResponse.json({
      reply: result.data.reply,
      suggestedLinks: result.data.suggestedLinks,
      engine: result.engine,
      provider: result.provider,
      usedFallback: result.usedFallback,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Chat error" }, { status: 500 });
  }
}
