import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalInteractions, recentInteractions, stats, recentChats] = await Promise.all([
      prisma.aIInteraction.count({ where: { userId: user.id } }),
      prisma.aIInteraction.count({ where: { userId: user.id, createdAt: { gte: thirtyDaysAgo } } }),
      prisma.aIInteraction.groupBy({
        by: ["demoType"],
        where: { userId: user.id },
        _count: { demoType: true },
      }),
      prisma.aIInteraction.findMany({
        where: { userId: user.id, demoType: "chat" },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const statsMap = stats.reduce((acc: Record<string, number>, curr) => {
      if (curr.demoType) acc[curr.demoType] = curr._count.demoType;
      return acc;
    }, {});

    return NextResponse.json({
      totalInteractions,
      recentInteractions,
      stats: statsMap,
      recentChats: recentChats.map((c) => ({
        id: c.id,
        demoType: c.demoType,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AI usage" }, { status: 500 });
  }
}
