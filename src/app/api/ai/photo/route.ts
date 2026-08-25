import { NextRequest, NextResponse } from "next/server";
import { processPhotoEdit } from "@/lib/mockAI";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();
    const result = await processPhotoEdit(action || "enhanceImage");

    try {
      await prisma.aIInteraction.create({
        data: {
          demoType: "photo",
          inputData: action || "enhanceImage",
          outputData: JSON.stringify(result),
        },
      });
    } catch (e) {}

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Photo edit error" }, { status: 500 });
  }
}
