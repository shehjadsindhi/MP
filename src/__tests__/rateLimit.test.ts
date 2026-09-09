import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { RateLimiter } from "@/lib/rateLimit";

describe("RateLimiter", () => {
  it("should allow requests within limit", () => {
    const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 3 });
    expect(limiter.check("test").allowed).toBe(true);
    expect(limiter.check("test").allowed).toBe(true);
    expect(limiter.check("test").allowed).toBe(true);
  });

  it("should block requests over limit", () => {
    const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 2 });
    expect(limiter.check("test").allowed).toBe(true);
    expect(limiter.check("test").allowed).toBe(true);
    expect(limiter.check("test").allowed).toBe(false);
  });
});
