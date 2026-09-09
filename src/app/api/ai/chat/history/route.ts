import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { aiApiRateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    const where: any = { userId: user.id, demoType: "chat" };
    if (conversationId) {
      where.inputData = { contains: `"conversationId":"${conversationId}"` };
    }

    const interactions = await prisma.aIInteraction.findMany({
      where,
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    const conversationsMap = new Map<string, any[]>();

    for (const interaction of interactions) {
      try {
        const inputData = typeof interaction.inputData === "string" ? JSON.parse(interaction.inputData) : interaction.inputData;
        const outputData = typeof interaction.outputData === "string" ? JSON.parse(interaction.outputData) : interaction.outputData;
        const convId = inputData?.conversationId || "default";

        if (!conversationsMap.has(convId)) {
          conversationsMap.set(convId, []);
        }
        conversationsMap.get(convId)!.push({
          id: interaction.id,
          conversationId: convId,
          message: inputData?.message || "",
          reply: outputData?.reply || "",
          suggestedLinks: outputData?.suggestedLinks || [],
          createdAt: interaction.createdAt,
        });
      } catch (e) {
        console.warn("Failed to parse AI interaction:", e);
      }
    }

    const conversations = Array.from(conversationsMap.entries()).map(([id, messages]) => ({
      id,
      messages,
      messageCount: messages.length,
      firstMessage: messages[0]?.message || "",
      lastMessage: messages[messages.length - 1]?.reply || "",
      createdAt: messages[0]?.createdAt,
      updatedAt: messages[messages.length - 1]?.createdAt,
    }));

    return NextResponse.json({ conversations });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 });
  }
}
