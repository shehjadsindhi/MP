import { hashPassword, comparePassword, signToken, verifyToken, TokenPayload } from "@/lib/auth";

describe("Authentication & JWT Utilities", () => {
  const originalJwtSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-jwt-secret-super-secure-key-32-chars-long";
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalJwtSecret;
  });

  describe("Password Hashing with Bcrypt", () => {
    it("should hash passwords securely and verify match correctly", async () => {
      const password = "SuperSecretPassword123!";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.startsWith("$2")).toBe(true);

      const isMatch = await comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it("should reject incorrect passwords", async () => {
      const password = "SuperSecretPassword123!";
      const hash = await hashPassword(password);

      const isMatch = await comparePassword("WrongPassword!", hash);
      expect(isMatch).toBe(false);
    });
  });

  describe("JWT Token Management", () => {
    const payload: TokenPayload = {
      userId: "user-uuid-123",
      email: "test@galaxyai.hub",
      role: "USER",
      name: "Galaxy Tester",
    };

    it("should sign and verify valid JWT tokens", () => {
      const token = signToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");

      const decoded = verifyToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(payload.userId);
      expect(decoded?.email).toBe(payload.email);
      expect(decoded?.role).toBe(payload.role);
      expect(decoded?.name).toBe(payload.name);
    });

    it("should return null for malformed or tampered tokens", () => {
      expect(verifyToken("invalid.jwt.token")).toBeNull();
      expect(verifyToken("")).toBeNull();
      expect(verifyToken("not-a-token")).toBeNull();

      const validToken = signToken(payload);
      const tamperedToken = validToken.slice(0, -5) + "abcde";
      expect(verifyToken(tamperedToken)).toBeNull();
    });
  });
});
