import { NextRequest, NextResponse } from "next/server";
import { getAssistantResponse } from "@/lib/mockAI";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const result = await getAssistantResponse(message, history || []);

    // Record interaction in database silently
    try {
      await prisma.aIInteraction.create({
        data: {
          demoType: "chat",
          inputData: message,
          outputData: JSON.stringify(result),
        },
      });
    } catch (dbErr) {
      // Continue even if DB write fails
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Chat error" }, { status: 500 });
  }
}
