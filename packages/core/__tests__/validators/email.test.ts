import { describe, it, expect } from "vitest";
import { runBuiltInRule } from "../../src/validators/built-in";

describe("email validator — TLD check (min 2 chars after last dot)", () => {
  const rule = { type: "email" as const };

  // ---- Valid emails ----

  it("accepts standard email", () => {
    expect(runBuiltInRule(rule, "user@example.com")).toBeNull();
  });

  it("accepts email with subdomain", () => {
    expect(runBuiltInRule(rule, "user@mail.example.com")).toBeNull();
  });

  it("accepts email with plus addressing", () => {
    expect(runBuiltInRule(rule, "user+tag@example.com")).toBeNull();
  });

  it("accepts email with dots in local part", () => {
    expect(runBuiltInRule(rule, "first.last@example.com")).toBeNull();
  });

  it("accepts email with two-letter TLD", () => {
    expect(runBuiltInRule(rule, "user@example.co")).toBeNull();
  });

  it("accepts email with long TLD", () => {
    expect(runBuiltInRule(rule, "user@example.museum")).toBeNull();
  });

  it("accepts email with numeric local part", () => {
    expect(runBuiltInRule(rule, "123@example.com")).toBeNull();
  });

  it("accepts email with hyphens in domain", () => {
    expect(runBuiltInRule(rule, "user@my-domain.com")).toBeNull();
  });

  // ---- Invalid emails ----

  it("rejects email with single-char TLD", () => {
    expect(runBuiltInRule(rule, "user@example.c")).not.toBeNull();
  });

  it("rejects email without TLD (no dot in domain)", () => {
    expect(runBuiltInRule(rule, "user@localhost")).not.toBeNull();
  });

  it("rejects email without @ sign", () => {
    expect(runBuiltInRule(rule, "userexample.com")).not.toBeNull();
  });

  it("rejects email with only @ sign", () => {
    expect(runBuiltInRule(rule, "user@")).not.toBeNull();
  });

  it("rejects plain text", () => {
    expect(runBuiltInRule(rule, "not-an-email")).not.toBeNull();
  });

  it("rejects email with spaces", () => {
    expect(runBuiltInRule(rule, "user @example.com")).not.toBeNull();
  });

  it("rejects email with multiple @ signs", () => {
    expect(runBuiltInRule(rule, "user@@example.com")).not.toBeNull();
  });

  // ---- Edge cases ----

  it("skips validation on empty string", () => {
    expect(runBuiltInRule(rule, "")).toBeNull();
  });

  it("skips validation on null", () => {
    expect(runBuiltInRule(rule, null)).toBeNull();
  });

  it("skips validation on undefined", () => {
    expect(runBuiltInRule(rule, undefined)).toBeNull();
  });

  it("uses custom error message when provided", () => {
    const customRule = { type: "email" as const, message: "Bad email" };
    expect(runBuiltInRule(customRule, "invalid")).toBe("Bad email");
  });
});
