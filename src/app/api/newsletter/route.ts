import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterRateLimit } from "@/lib/rateLimit";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
});

export async function POST(req: NextRequest) {
  const rateLimitResult = newsletterRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const email = result.data.email.trim().toLowerCase();

    try {
      await prisma.newsletterSubscriber.create({
        data: { email },
      });

      return NextResponse.json({
        success: true,
        message: "Successfully subscribed to Galaxy AI Intelligence updates!",
      });
    } catch (dbError: any) {
      if (dbError.code === "P2002") {
        return NextResponse.json({
          success: true,
          message: "You are already subscribed to Galaxy AI intelligence updates.",
          alreadySubscribed: true,
        });
      }
      throw dbError;
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ subscribers, count: subscribers.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const emailParam = searchParams.get("email");
    const id = searchParams.get("id");

    if (!emailParam && !id) {
      return NextResponse.json({ error: "Email or ID is required" }, { status: 400 });
    }

    if (id) {
      const user = await getSessionUser();
      if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
      await prisma.newsletterSubscriber.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "Subscriber removed" });
    }

    if (emailParam) {
      const email = emailParam.trim().toLowerCase();
      await prisma.newsletterSubscriber.deleteMany({ where: { email } });
      return NextResponse.json({ success: true, message: "You have been successfully unsubscribed." });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process unsubscribe request" }, { status: 500 });
  }
}
