import { NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/mockAI";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang, targetLang } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const result = await translateText(text, sourceLang, targetLang);

    try {
      await prisma.aIInteraction.create({
        data: {
          demoType: "translation",
          inputData: JSON.stringify({ text, sourceLang, targetLang }),
          outputData: JSON.stringify(result),
        },
      });
    } catch (e) {}

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Translation error" }, { status: 500 });
  }
}
