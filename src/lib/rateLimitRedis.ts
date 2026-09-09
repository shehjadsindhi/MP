export type RateLimitStore = Map<string, { count: number; resetTime: number }>;

export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: any) => string;
}

export class RateLimiter {
  private store: RateLimitStore = new Map();
  private windowMs: number;
  private maxRequests: number;
  private keyGenerator: (req: any) => string;

  constructor(options: RateLimiterOptions) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;
    this.keyGenerator = options.keyGenerator || ((req) => req.ip || req.connection?.remoteAddress || "unknown");
  }

  check(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.resetTime <= now) {
      this.store.set(key, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true, remaining: this.maxRequests - 1, resetTime: now + this.windowMs };
    }

    if (entry.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    entry.count += 1;
    return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime };
  }

  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.store.entries());
    for (const [key, entry] of entries) {
      if (entry.resetTime <= now) {
        this.store.delete(key);
      }
    }
  }
}

export interface RedisRateLimiterOptions extends RateLimiterOptions {
  redisClient?: any;
  prefix?: string;
}

export class RedisRateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private redisClient: any;
  private prefix: string;

  constructor(options: RedisRateLimiterOptions) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;
    this.redisClient = options.redisClient;
    this.prefix = options.prefix || "ratelimit:";
  }

  async check(key: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    if (!this.redisClient) {
      throw new Error("Redis client not configured");
    }

    const redisKey = `${this.prefix}${key}`;
    const now = Date.now();
    const windowEnd = now + this.windowMs;

    try {
      const count = await this.redisClient.incr(redisKey);

      if (count === 1) {
        await this.redisClient.expire(redisKey, Math.ceil(this.windowMs / 1000));
      }

      const ttl = await this.redisClient.ttl(redisKey);
      const resetTime = now + ttl * 1000;

      if (count > this.maxRequests) {
        return { allowed: false, remaining: 0, resetTime };
      }

      return { allowed: true, remaining: this.maxRequests - count, resetTime };
    } catch (error) {
      console.error("Redis rate limit error:", error);
      return { allowed: true, remaining: this.maxRequests, resetTime: windowEnd };
    }
  }
}

export const rateLimiters = {
  auth: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 5 }),
  aiApi: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 20 }),
  order: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 10 }),
  newsletter: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 5 }),
  adminMutation: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 30 }),
};
