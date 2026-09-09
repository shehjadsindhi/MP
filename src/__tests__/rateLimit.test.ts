import { describe, it, expect } from "@jest/globals";
import { rateLimit } from "@/lib/rateLimit";
import { NextRequest } from "next/server";

describe("rateLimit", () => {
  it("should allow requests within limit", () => {
    const limiter = rateLimit({ windowMs: 60000, maxRequests: 3 }, "test-store-1");
    const req = new NextRequest("http://localhost/api/test", {
      headers: { "x-forwarded-for": "127.0.0.1" },
    });

    expect(limiter(req)).toBeNull();
    expect(limiter(req)).toBeNull();
    expect(limiter(req)).toBeNull();
  });

  it("should block requests over limit", () => {
    const limiter = rateLimit({ windowMs: 60000, maxRequests: 2 }, "test-store-2");
    const req = new NextRequest("http://localhost/api/test", {
      headers: { "x-forwarded-for": "127.0.0.2" },
    });

    expect(limiter(req)).toBeNull();
    expect(limiter(req)).toBeNull();

    const res = limiter(req);
    expect(res).not.toBeNull();
    expect(res?.status).toBe(429);
  });
});

