import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin required." }, { status: 403 });
    }

    const [
      userCount,
      orderCount,
      productCount,
      featureCount,
      articleCount,
      offerCount,
      reviewCount,
      subscriberCount,
      aiInteractionCount,
      lowStockProducts,
      recentOrders,
      allOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.aIFeature.count(),
      prisma.article.count(),
      prisma.offer.count(),
      prisma.review.count(),
      prisma.newsletterSubscriber.count(),
      prisma.aIInteraction.count(),
      prisma.product.findMany({
        where: { stock: { lte: 10 } },
        select: { id: true, name: true, stock: true, price: true, category: true },
        take: 10,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { items: true },
      }),
      prisma.order.findMany({
        select: { total: true, orderStatus: true, createdAt: true },
      }),
    ]);

    const totalRevenue = allOrders.reduce(
      (sum, o) => (o.orderStatus !== "Cancelled" ? sum + o.total : sum),
      0
    );

    const pendingOrders = allOrders.filter(
      (o) => o.orderStatus === "Processing" || o.orderStatus === "Pending"
    ).length;
    const deliveredOrders = allOrders.filter((o) => o.orderStatus === "Delivered").length;
    const cancelledOrders = allOrders.filter((o) => o.orderStatus === "Cancelled").length;

    // Real monthly sales aggregated by actual database order createdAt dates
    const monthsMap: Record<string, { revenue: number; orders: number }> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (const ord of allOrders) {
      const d = new Date(ord.createdAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (!monthsMap[key]) {
        monthsMap[key] = { revenue: 0, orders: 0 };
      }
      monthsMap[key].orders++;
      if (ord.orderStatus !== "Cancelled") {
        monthsMap[key].revenue += ord.total;
      }
    }

    const monthlyStats = Object.entries(monthsMap).map(([month, data]) => ({
      month,
      revenue: Math.round(data.revenue),
      orders: data.orders,
    }));

    return NextResponse.json({
      metrics: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        orderCount,
        userCount,
        productCount,
        featureCount,
        articleCount,
        offerCount,
        reviewCount,
        subscriberCount,
        aiInteractionCount,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
      },
      lowStockProducts,
      recentOrders,
      monthlyStats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch live database analytics" },
      { status: 500 }
    );
  }
}
