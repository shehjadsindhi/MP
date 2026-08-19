import { NextRequest, NextResponse } from "next/server";
import { processPhotoEdit } from "@/lib/mockAI";

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();
    const result = await processPhotoEdit(action || "enhanceImage");
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Photo edit error" }, { status: 500 });
  }
}
