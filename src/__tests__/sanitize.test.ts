import { describe, it, expect, jest, beforeEach } from "@jest/globals";

describe("Sanitize", () => {
  it("should escape HTML characters", () => {
    const { sanitizeHtml } = require("@/lib/security");
    const dirty = '<script>alert("xss")</script>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain("<script>");
    expect(clean).not.toContain("</script>");
  });

  it("should sanitize objects", () => {
    const { sanitizeObject } = require("@/lib/security");
    const obj = { name: "<b>test</b>", nested: { value: "<script>evil</script>" } };
    const clean = sanitizeObject(obj);
    expect(clean.name).not.toContain("<b>");
    expect(clean.nested.value).not.toContain("<script>");
  });
});
