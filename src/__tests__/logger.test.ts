import { describe, it, expect, jest, beforeEach } from "@jest/globals";

describe("Logger", () => {
  it("should not throw on log methods", () => {
    const { logger } = require("@/lib/logger");
    expect(() => logger.debug("test")).not.toThrow();
    expect(() => logger.info("test")).not.toThrow();
    expect(() => logger.warn("test")).not.toThrow();
    expect(() => logger.error("test", new Error("err"))).not.toThrow();
  });
});
