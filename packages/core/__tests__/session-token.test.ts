import { describe, it, expect, vi, afterEach } from "vitest";
import { generateSessionToken } from "../src/utils/session-token";

describe("generateSessionToken", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a string", () => {
    const token = generateSessionToken();
    expect(typeof token).toBe("string");
  });

  it("returns a UUID v4 format string", () => {
    const token = generateSessionToken();
    // UUID v4 format: 8-4-4-4-12 hex chars
    expect(token).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it("generates unique tokens on successive calls", () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 100; i++) {
      tokens.add(generateSessionToken());
    }
    expect(tokens.size).toBe(100);
  });

  it("uses crypto.randomUUID when available", () => {
    const mockUUID = "12345678-1234-4321-abcd-123456789abc";
    const spy = vi.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID as `${string}-${string}-${string}-${string}-${string}`);
    const token = generateSessionToken();
    expect(token).toBe(mockUUID);
    expect(spy).toHaveBeenCalled();
  });

  it("falls back to crypto.getRandomValues when randomUUID is unavailable", () => {
    const originalRandomUUID = crypto.randomUUID;
    try {
      // Remove randomUUID to force getRandomValues fallback
      (crypto as any).randomUUID = undefined;
      const token = generateSessionToken();
      // Should still produce valid UUID v4 format
      expect(token).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
    } finally {
      (crypto as any).randomUUID = originalRandomUUID;
    }
  });

  it("getRandomValues fallback sets correct version and variant bits", () => {
    const originalRandomUUID = crypto.randomUUID;
    try {
      (crypto as any).randomUUID = undefined;
      // Run multiple times to verify consistency
      for (let i = 0; i < 20; i++) {
        const token = generateSessionToken();
        const parts = token.split("-");
        // Version nibble (13th hex char) must be "4"
        expect(parts[2][0]).toBe("4");
        // Variant nibble (17th hex char) must be 8, 9, a, or b
        expect(["8", "9", "a", "b"]).toContain(parts[3][0]);
      }
    } finally {
      (crypto as any).randomUUID = originalRandomUUID;
    }
  });

  it("token has correct segment lengths", () => {
    const token = generateSessionToken();
    const parts = token.split("-");
    expect(parts).toHaveLength(5);
    expect(parts[0]).toHaveLength(8);
    expect(parts[1]).toHaveLength(4);
    expect(parts[2]).toHaveLength(4);
    expect(parts[3]).toHaveLength(4);
    expect(parts[4]).toHaveLength(12);
  });
});
