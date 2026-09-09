export interface RedisRateLimitConfig {
  url?: string;
  prefix?: string;
  windowMs: number;
  maxRequests: number;
}

export function getRedisRateLimitConfig(): RedisRateLimitConfig {
  return {
    url: process.env.REDIS_URL,
    prefix: process.env.REDIS_RATE_LIMIT_PREFIX || "ratelimit:",
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60 * 1000),
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 20),
  };
}

export function isRedisConfigured(): boolean {
  return !!process.env.REDIS_URL;
}
