import { describe, it, expect, vi } from "vitest";
import crypto from "node:crypto";
import { encrypt, decrypt } from "../src/encryption";

// Generate a test key
const testKey = crypto.randomBytes(32).toString("base64");

describe("Postgres encryption", () => {
  it("round-trips a string", () => {
    const plaintext = "hello world";
    const encrypted = encrypt(plaintext, testKey);
    const decrypted = decrypt(encrypted, testKey);
    expect(decrypted).toBe(plaintext);
  });

  it("round-trips JSON data", () => {
    const data = { name: "Alice", email: "a@b.com", score: 42 };
    const plaintext = JSON.stringify(data);
    const encrypted = encrypt(plaintext, testKey);
    const decrypted = decrypt(encrypted, testKey);
    expect(JSON.parse(decrypted)).toEqual(data);
  });

  it("produces different ciphertexts for same plaintext", () => {
    const plaintext = "test";
    const a = encrypt(plaintext, testKey);
    const b = encrypt(plaintext, testKey);
    expect(a).not.toBe(b);
    expect(decrypt(a, testKey)).toBe(plaintext);
    expect(decrypt(b, testKey)).toBe(plaintext);
  });

  it("fails with wrong key", () => {
    const wrongKey = crypto.randomBytes(32).toString("base64");
    const encrypted = encrypt("secret", testKey);
    expect(() => decrypt(encrypted, wrongKey)).toThrow();
  });

  it("fails with invalid key length", () => {
    const shortKey = crypto.randomBytes(16).toString("base64");
    expect(() => encrypt("test", shortKey)).toThrow(
      "Encryption key must be exactly 32 bytes",
    );
  });
});

describe("createPostgresAdapter (factory)", () => {
  it("exports the factory function", async () => {
    const { createPostgresAdapter } = await import("../src/postgres-adapter");
    expect(typeof createPostgresAdapter).toBe("function");
  });

  it("adapter has name 'postgres'", async () => {
    // We can't actually connect, but we can test the factory returns correct shape
    // by mocking the postgres/drizzle imports
    vi.mock("postgres", () => ({
      default: () => ({}),
    }));
    vi.mock("drizzle-orm/postgres-js", () => ({
      drizzle: () => ({ insert: vi.fn() }),
    }));

    const { createPostgresAdapter } = await import("../src/postgres-adapter");
    const adapter = createPostgresAdapter({
      connectionString: "postgresql://test:test@localhost/test",
    });
    expect(adapter.name).toBe("postgres");
  });
});

describe("createPostgresDraftAdapter (factory)", () => {
  it("exports the factory function", async () => {
    const { createPostgresDraftAdapter } = await import(
      "../src/postgres-draft-adapter"
    );
    expect(typeof createPostgresDraftAdapter).toBe("function");
  });
});
