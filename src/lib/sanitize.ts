import { NextRequest, NextResponse } from "next/server";
import { sanitizeObject } from "@/lib/security";

export function withSanitizedBody<T extends Record<string, any>>(
  handler: (req: NextRequest, sanitized: T) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const body = await req.json().catch(() => ({}));
    const sanitized = sanitizeObject(body) as T;
    return handler(req, sanitized);
  };
}

export function sanitizeQueryParam(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .trim();
}
