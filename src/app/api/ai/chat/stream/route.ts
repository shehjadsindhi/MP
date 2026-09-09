import { NextRequest, NextResponse } from "next/server";
import { streamAIResponse } from "@/lib/aiProvider";
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
    const conversationId = body.conversationId || `conv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    if (!message || message.length > 2000) {
      return NextResponse.json(
        { error: message ? "Message exceeds 2000 character limit." : "Message is required." },
        { status: 400 }
      );
    }

    const sessionUser = await getSessionUser().catch(() => null);
    const fullPrompt = history.length > 0 
      ? [...history, { role: "user", content: message }].map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n\n") + "\n\nAssistant:"
      : message;

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let fullReply = "";

        try {
          for await (const chunk of streamAIResponse(fullPrompt)) {
            fullReply += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          controller.enqueue(encoder.encode(`[Stream error: ${error instanceof Error ? error.message : "Unknown error"}]`));
        } finally {
          controller.close();

          try {
            await prisma.aIInteraction.create({
              data: {
                userId: sessionUser?.id || null,
                demoType: "chat",
                inputData: JSON.stringify({ message, conversationId }),
                outputData: JSON.stringify({ reply: fullReply, suggestedLinks: [] }),
              },
            });
          } catch (dbErr) {
            console.warn("Failed to log AI interaction:", dbErr);
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
        "X-Conversation-Id": conversationId,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Chat error" }, { status: 500 });
  }
}
