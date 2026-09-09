import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { z } from "zod";

const socialSchema = z.object({
  provider: z.enum(["google", "apple"]),
  idToken: z.string().min(1, "ID token is required"),
  email: z.string().email().optional(),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = socialSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { provider, idToken, email, name } = result.data;

    if (!process.env[`${provider.toUpperCase()}_CLIENT_ID`]) {
      return NextResponse.json({ error: `${provider} auth is not configured` }, { status: 500 });
    }

    const userEmail = email || `${provider}_${idToken.substring(0, 20)}@social.local`;
    const userName = name || `${provider} User`;

    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      const randomPassword = `${provider}-${idToken}-${Date.now()}`;
      const passwordHash = await hashPassword(randomPassword);

      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userName,
          password: passwordHash,
          role: "USER",
          savedPersona: "Everyday User",
        },
      });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedPersona: user.savedPersona,
      },
    });

    response.cookies.set("galaxy_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Social auth failed" }, { status: 500 });
  }
}
