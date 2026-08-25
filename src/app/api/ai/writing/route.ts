import { NextRequest, NextResponse } from "next/server";
import { rewriteText } from "@/lib/mockAI";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { text, tone } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const result = await rewriteText(text, tone || "Professional");

    try {
      await prisma.aIInteraction.create({
        data: {
          demoType: "writing",
          inputData: JSON.stringify({ text, tone }),
          outputData: JSON.stringify(result),
        },
      });
    } catch (e) {}

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Writing assist error" }, { status: 500 });
  }
}
