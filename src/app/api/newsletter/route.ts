import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterRateLimit } from "@/lib/rateLimit";
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
    return NextResponse.json(
      { error: "Failed to process newsletter subscription." },
      { status: 500 }
    );
  }
}
