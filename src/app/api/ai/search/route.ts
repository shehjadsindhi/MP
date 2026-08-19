import { NextRequest, NextResponse } from "next/server";
import { searchGalaxyAI } from "@/lib/mockAI";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const result = await searchGalaxyAI(query);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Search AI error" }, { status: 500 });
  }
}
