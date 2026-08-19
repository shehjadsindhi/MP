import { NextRequest, NextResponse } from "next/server";
import { processNotes } from "@/lib/mockAI";

export async function POST(req: NextRequest) {
  try {
    const { text, action } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Notes text is required" }, { status: 400 });
    }

    const result = await processNotes(text, action || "summarize");
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Note assist error" }, { status: 500 });
  }
}
