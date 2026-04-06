import { describe, it, expect } from "vitest";
import { signPayload } from "../src/signer";

describe("signPayload", () => {
  it("produces a 64-char hex string (SHA-256)", () => {
    const sig = signPayload('{"event":"test"}', "my-secret");
    expect(sig).toMatch(/^[a-f0-9]{64}$/);
  });

  it("is deterministic for same input", () => {
    const payload = '{"event":"submit"}';
    expect(signPayload(payload, "s")).toBe(signPayload(payload, "s"));
  });

  it("differs for different secrets", () => {
    const p = '{"event":"test"}';
    expect(signPayload(p, "s1")).not.toBe(signPayload(p, "s2"));
  });

  it("differs for different payloads", () => {
    expect(signPayload("a", "s")).not.toBe(signPayload("b", "s"));
  });
});
