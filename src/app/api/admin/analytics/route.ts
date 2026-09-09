import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      activeUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
      lowStockProducts,
      totalReviews,
      totalAIFeatures,
      totalArticles,
      newsletterSubscribers,
      recentOrders,
      topProducts,
      aiUsageStats,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { updatedAt: { gte: thirtyDaysAgo } } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lt: 10 } } }),
      prisma.review.count(),
      prisma.aIFeature.count(),
      prisma.article.count(),
      prisma.newsletterSubscriber.count(),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } }, items: { take: 2 } },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { rating: "desc" },
        select: { id: true, name: true, price: true, rating: true, reviewCount: true, image: true },
      }),
      prisma.aIInteraction.groupBy({
        by: ["demoType"],
        where: { createdAt: { gte: thirtyDaysAgo } },
        _count: { demoType: true },
      }),
    ]);

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        totalProducts,
        lowStockProducts,
        totalReviews,
        totalAIFeatures,
        totalArticles,
        newsletterSubscribers,
      },
      recentOrders,
      topProducts,
      aiUsage: aiUsageStats.reduce((acc: Record<string, number>, curr) => {
        if (curr.demoType) acc[curr.demoType] = curr._count.demoType;
        return acc;
      }, {}),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
