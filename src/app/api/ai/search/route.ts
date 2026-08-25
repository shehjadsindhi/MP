import { NextRequest, NextResponse } from "next/server";
import { searchGalaxyAI } from "@/lib/mockAI";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const result = await searchGalaxyAI(query);

    try {
      await prisma.aIInteraction.create({
        data: {
          demoType: "search",
          inputData: query,
          outputData: JSON.stringify(result),
        },
      });
    } catch (e) {}

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Search AI error" }, { status: 500 });
  }
}
