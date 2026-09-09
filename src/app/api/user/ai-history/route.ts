export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { authRateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const rateLimitResult = authRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const demoType = searchParams.get("demoType");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100");

    const where: any = { userId: user.id };
    if (demoType) where.demoType = demoType;
    if (search) {
      where.OR = [
        { inputData: { contains: search } },
        { outputData: { contains: search } },
      ];
    }

    const interactions = await prisma.aIInteraction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 500),
    });

    const stats = await prisma.aIInteraction.groupBy({
      by: ["demoType"],
      where: { userId: user.id },
      _count: { demoType: true },
    });

    return NextResponse.json({
      interactions,
      stats: stats.reduce((acc: Record<string, number>, curr) => {
        if (curr.demoType) acc[curr.demoType] = curr._count.demoType;
        return acc;
      }, {}),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AI history" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const rateLimitResult = authRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, all, demoType } = body;

    if (all === true) {
      const where: any = { userId: user.id };
      if (demoType) where.demoType = demoType;

      const result = await prisma.aIInteraction.deleteMany({ where });
      return NextResponse.json({ success: true, deleted: result.count });
    }

    if (id) {
      const interaction = await prisma.aIInteraction.findFirst({
        where: { id, userId: user.id },
      });

      if (!interaction) {
        return NextResponse.json({ error: "Interaction not found" }, { status: 404 });
      }

      await prisma.aIInteraction.delete({ where: { id } });
      return NextResponse.json({ success: true, deleted: 1 });
    }

    return NextResponse.json({ error: "Missing id or all parameter" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete AI history" }, { status: 500 });
  }
}
