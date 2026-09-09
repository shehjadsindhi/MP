import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: "unknown",
      redis: "unknown",
    },
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = "healthy";
  } catch (error) {
    health.checks.database = "unhealthy";
    health.status = "degraded";
  }

  try {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      const Redis = (await import("ioredis")).default;
      const redis = new Redis(redisUrl);
      await redis.ping();
      await redis.quit();
      health.checks.redis = "healthy";
    } else {
      health.checks.redis = "not_configured";
    }
  } catch (error) {
    health.checks.redis = "unhealthy";
    health.status = "degraded";
  }

  const statusCode = health.status === "healthy" ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
