import { describe, it, expect, jest, beforeEach } from "@jest/globals";

describe("Cache", () => {
  it("getRedisClient returns null without REDIS_URL", () => {
    const { getRedisClient } = require("@/lib/cache");
    expect(getRedisClient()).toBeNull();
  });
});
