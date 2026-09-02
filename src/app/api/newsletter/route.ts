import { NextRequest, NextResponse } from "next/server";

// In-memory newsletter subscribers list for runtime demonstration & verification
const subscriberSet = new Set<string>();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (subscriberSet.has(email)) {
      return NextResponse.json({
        success: true,
        message: "You are already subscribed to Galaxy AI intelligence updates.",
        alreadySubscribed: true,
      });
    }

    subscriberSet.add(email);

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to Galaxy AI Intelligence updates!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to process newsletter subscription." },
      { status: 500 }
    );
  }
}
