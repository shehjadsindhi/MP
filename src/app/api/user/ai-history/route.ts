export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const interactions = await prisma.aIInteraction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ interactions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AI history" }, { status: 500 });
  }
}
