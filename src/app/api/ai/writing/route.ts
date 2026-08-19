import { NextRequest, NextResponse } from "next/server";
import { rewriteText } from "@/lib/mockAI";

export async function POST(req: NextRequest) {
  try {
    const { text, tone } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const result = await rewriteText(text, tone || "Professional");
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Writing assist error" }, { status: 500 });
  }
}
