import { NextRequest, NextResponse } from "next/server";
import { getAssistantResponse } from "@/lib/mockAI";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const result = await getAssistantResponse(message, history || []);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Chat error" }, { status: 500 });
  }
}
