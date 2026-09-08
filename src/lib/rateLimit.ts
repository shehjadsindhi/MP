import { NextRequest, NextResponse } from "next/server";

type RateLimitStore = Map<string, { count: number; resetTime: number }>;

const rateLimitStores: Record<string, RateLimitStore> = {};

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

function getStore(name: string): RateLimitStore {
  if (!rateLimitStores[name]) {
    rateLimitStores[name] = new Map();
  }
  return rateLimitStores[name];
}

function cleanupStore(store: RateLimitStore, now: number) {
  const entries = Array.from(store.entries());
  for (const [key, entry] of entries) {
    if (entry.resetTime <= now) {
      store.delete(key);
    }
  }
}

export function rateLimit(
  config: RateLimitConfig,
  storeName: string = "default"
): (req: NextRequest) => NextResponse | null {
  const { windowMs, maxRequests, message = "Too many requests. Please try again later." } = config;
  const store = getStore(storeName);

  return (req: NextRequest): NextResponse | null => {
    const now = Date.now();
    cleanupStore(store, now);

    let clientIP: string;
    const forwardedFor = req.headers.get("x-forwarded-for");
    const xForwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) {
      clientIP = forwardedFor.split(",")[0].trim();
    } else if (xForwardedFor) {
      clientIP = xForwardedFor.split(",")[0].trim();
    } else {
      clientIP = "unknown";
    }

    const key = `${clientIP}:${storeName}`;
    const entry = store.get(key);
    const resetTime = now + windowMs;

    if (entry) {
      if (entry.resetTime <= now) {
        store.set(key, { count: 1, resetTime });
        return null;
      }
      entry.count++;
      if (entry.count > maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        return NextResponse.json(
          { error: message, retryAfter },
          { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
      }
      return null;
    }

    store.set(key, { count: 1, resetTime });
    return null;
  };
}

export const authRateLimit = rateLimit({ windowMs: 60_000, maxRequests: 5 }, "auth");
export const aiApiRateLimit = rateLimit({ windowMs: 60_000, maxRequests: 20 }, "ai-api");
export const orderRateLimit = rateLimit({ windowMs: 60_000, maxRequests: 10 }, "order");
export const newsletterRateLimit = rateLimit({ windowMs: 60_000, maxRequests: 5 }, "newsletter");
export const adminMutationRateLimit = rateLimit({ windowMs: 60_000, maxRequests: 30 }, "admin-mutation");
