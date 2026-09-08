import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET;

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

function getJwtSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required. Application cannot sign tokens without it.");
  }
  return JWT_SECRET;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("galaxy_auth_token")?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        country: true,
        savedPersona: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin privileges required");
  }
  return user;
}
