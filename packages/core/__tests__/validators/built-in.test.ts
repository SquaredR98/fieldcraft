import { describe, it, expect } from "vitest";
import { runBuiltInRule } from "../../src/validators/built-in";

// ---- required ----

describe("required validator", () => {
  const rule = { type: "required" as const };

  it("fails for undefined", () => {
    expect(runBuiltInRule(rule, undefined)).toBe("This field is required");
  });

  it("fails for null", () => {
    expect(runBuiltInRule(rule, null)).toBe("This field is required");
  });

  it("fails for empty string", () => {
    expect(runBuiltInRule(rule, "")).toBe("This field is required");
  });

  it("fails for empty array", () => {
    expect(runBuiltInRule(rule, [])).toBe("This field is required");
  });

  it("passes for non-empty string", () => {
    expect(runBuiltInRule(rule, "hello")).toBeNull();
  });

  it("passes for number 0 (falsy but valid)", () => {
    expect(runBuiltInRule(rule, 0)).toBeNull();
  });

  it("passes for boolean false (valid boolean answer)", () => {
    expect(runBuiltInRule(rule, false)).toBeNull();
  });

  it("passes for non-empty array", () => {
    expect(runBuiltInRule(rule, ["a"])).toBeNull();
  });

  it("uses custom message when provided", () => {
    const customRule = { type: "required" as const, message: "Please fill this in" };
    expect(runBuiltInRule(customRule, "")).toBe("Please fill this in");
  });
});

// ---- min ----

describe("min validator", () => {
  const rule = { type: "min" as const, value: 5 };

  it("fails when number is below min", () => {
    expect(runBuiltInRule(rule, 3)).toBe("Must be at least 5");
  });

  it("passes when number equals min", () => {
    expect(runBuiltInRule(rule, 5)).toBeNull();
  });

  it("passes when number exceeds min", () => {
    expect(runBuiltInRule(rule, 10)).toBeNull();
  });

  it("coerces string to number", () => {
    expect(runBuiltInRule(rule, "3")).toBe("Must be at least 5");
    expect(runBuiltInRule(rule, "10")).toBeNull();
  });

  it("passes for empty values (not a required check)", () => {
    expect(runBuiltInRule(rule, "")).toBeNull();
    expect(runBuiltInRule(rule, null)).toBeNull();
    expect(runBuiltInRule(rule, undefined)).toBeNull();
  });

  it("passes for NaN values (non-numeric strings)", () => {
    expect(runBuiltInRule(rule, "abc")).toBeNull();
  });

  it("uses custom message", () => {
    const customRule = { type: "min" as const, value: 0, message: "No negatives" };
    expect(runBuiltInRule(customRule, -1)).toBe("No negatives");
  });
});

// ---- max ----

describe("max validator", () => {
  const rule = { type: "max" as const, value: 100 };

  it("fails when number exceeds max", () => {
    expect(runBuiltInRule(rule, 150)).toBe("Must be at most 100");
  });

  it("passes when number equals max", () => {
    expect(runBuiltInRule(rule, 100)).toBeNull();
  });

  it("passes when number is below max", () => {
    expect(runBuiltInRule(rule, 50)).toBeNull();
  });

  it("passes for empty values", () => {
    expect(runBuiltInRule(rule, "")).toBeNull();
    expect(runBuiltInRule(rule, undefined)).toBeNull();
  });
});

// ---- minLength ----

describe("minLength validator", () => {
  const rule = { type: "minLength" as const, value: 3 };

  it("fails when string is too short", () => {
    expect(runBuiltInRule(rule, "ab")).toBe("Must be at least 3 characters");
  });

  it("passes when string meets min length", () => {
    expect(runBuiltInRule(rule, "abc")).toBeNull();
  });

  it("passes when string exceeds min length", () => {
    expect(runBuiltInRule(rule, "abcdef")).toBeNull();
  });

  it("passes for empty values", () => {
    expect(runBuiltInRule(rule, "")).toBeNull();
    expect(runBuiltInRule(rule, undefined)).toBeNull();
  });

  it("coerces non-string values to string", () => {
    expect(runBuiltInRule(rule, 12)).toBe("Must be at least 3 characters");
    expect(runBuiltInRule(rule, 123)).toBeNull();
  });
});

// ---- maxLength ----

describe("maxLength validator", () => {
  const rule = { type: "maxLength" as const, value: 5 };

  it("fails when string exceeds max length", () => {
    expect(runBuiltInRule(rule, "toolong")).toBe("Must be at most 5 characters");
  });

  it("passes when string meets max length", () => {
    expect(runBuiltInRule(rule, "exact")).toBeNull();
  });

  it("passes when string is shorter than max", () => {
    expect(runBuiltInRule(rule, "hi")).toBeNull();
  });

  it("passes for empty values", () => {
    expect(runBuiltInRule(rule, "")).toBeNull();
  });
});

// ---- pattern ----

describe("pattern validator", () => {
  it("passes when value matches regex", () => {
    const rule = { type: "pattern" as const, regex: "^[A-Z]{2}\\d{4}$" };
    expect(runBuiltInRule(rule, "AB1234")).toBeNull();
  });

  it("fails when value does not match regex", () => {
    const rule = { type: "pattern" as const, regex: "^[A-Z]{2}\\d{4}$" };
    expect(runBuiltInRule(rule, "abc")).toBe("Invalid format");
  });

  it("supports regex flags (case-insensitive)", () => {
    const rule = { type: "pattern" as const, regex: "^hello$", flags: "i" };
    expect(runBuiltInRule(rule, "HELLO")).toBeNull();
  });

  it("returns error for invalid regex", () => {
    const rule = { type: "pattern" as const, regex: "[invalid" };
    expect(runBuiltInRule(rule, "test")).toBe("Invalid format");
  });

  it("passes for empty values", () => {
    const rule = { type: "pattern" as const, regex: "^\\d+$" };
    expect(runBuiltInRule(rule, "")).toBeNull();
  });

  it("uses custom message", () => {
    const rule = { type: "pattern" as const, regex: "^\\d{5}$", message: "Must be a 5-digit ZIP code" };
    expect(runBuiltInRule(rule, "abc")).toBe("Must be a 5-digit ZIP code");
  });
});

// ---- phone ----

describe("phone validator", () => {
  const rule = { type: "phone" as const };

  it("accepts standard US number", () => {
    expect(runBuiltInRule(rule, "555-123-4567")).toBeNull();
  });

  it("accepts international format with +", () => {
    expect(runBuiltInRule(rule, "+1 555 123 4567")).toBeNull();
  });

  it("accepts number with parentheses", () => {
    expect(runBuiltInRule(rule, "(555) 123-4567")).toBeNull();
  });

  it("accepts plain digits", () => {
    expect(runBuiltInRule(rule, "5551234567")).toBeNull();
  });

  it("rejects too-short numbers", () => {
    expect(runBuiltInRule(rule, "123")).toBe("Please enter a valid phone number");
  });

  it("rejects strings with letters", () => {
    expect(runBuiltInRule(rule, "555-CALL-ME")).toBe("Please enter a valid phone number");
  });

  it("passes for empty values", () => {
    expect(runBuiltInRule(rule, "")).toBeNull();
  });
});

// ---- url ----

describe("url validator", () => {
  const rule = { type: "url" as const };

  it("accepts valid https URL", () => {
    expect(runBuiltInRule(rule, "https://example.com")).toBeNull();
  });

  it("accepts valid http URL", () => {
    expect(runBuiltInRule(rule, "http://example.com/path?q=1")).toBeNull();
  });

  it("rejects URL without protocol", () => {
    expect(runBuiltInRule(rule, "example.com")).toBe("Please enter a valid URL");
  });

  it("rejects random string", () => {
    expect(runBuiltInRule(rule, "not a url")).toBe("Please enter a valid URL");
  });

  it("passes for empty values", () => {
    expect(runBuiltInRule(rule, "")).toBeNull();
  });
});

// ---- date ----

describe("date validator", () => {
  it("accepts valid ISO date", () => {
    const rule = { type: "date" as const };
    expect(runBuiltInRule(rule, "2024-06-15")).toBeNull();
  });

  it("rejects invalid date string", () => {
    const rule = { type: "date" as const };
    expect(runBuiltInRule(rule, "not-a-date")).toBe("Please enter a valid date");
  });

  it("rejects date before min", () => {
    const rule = { type: "date" as const, min: "2024-01-01" };
    expect(runBuiltInRule(rule, "2023-12-31")).toBe("Date must be after 2024-01-01");
  });

  it("passes date on min boundary", () => {
    const rule = { type: "date" as const, min: "2024-01-01" };
    expect(runBuiltInRule(rule, "2024-01-01")).toBeNull();
  });

  it("rejects date after max", () => {
    const rule = { type: "date" as const, max: "2025-12-31" };
    expect(runBuiltInRule(rule, "2026-01-01")).toBe("Date must be before 2025-12-31");
  });

  it("passes date on max boundary", () => {
    const rule = { type: "date" as const, max: "2025-12-31" };
    expect(runBuiltInRule(rule, "2025-12-31")).toBeNull();
  });

  it("validates within a min-max range", () => {
    const rule = { type: "date" as const, min: "2024-01-01", max: "2024-12-31" };
    expect(runBuiltInRule(rule, "2024-06-15")).toBeNull();
    expect(runBuiltInRule(rule, "2023-06-15")).not.toBeNull();
    expect(runBuiltInRule(rule, "2025-06-15")).not.toBeNull();
  });

  it("passes for empty values", () => {
    const rule = { type: "date" as const };
    expect(runBuiltInRule(rule, "")).toBeNull();
  });
});

// ---- fileSize ----

describe("fileSize validator", () => {
  it("passes when file is under max", () => {
    const rule = { type: "fileSize" as const, maxMb: 5 };
    expect(runBuiltInRule(rule, { size: 2 * 1024 * 1024 })).toBeNull();
  });

  it("fails when file exceeds max", () => {
    const rule = { type: "fileSize" as const, maxMb: 5 };
    expect(runBuiltInRule(rule, { size: 10 * 1024 * 1024 })).toBe("File must be smaller than 5MB");
  });

  it("passes when file is exactly at max", () => {
    const rule = { type: "fileSize" as const, maxMb: 5 };
    expect(runBuiltInRule(rule, { size: 5 * 1024 * 1024 })).toBeNull();
  });

  it("passes for empty values", () => {
    const rule = { type: "fileSize" as const, maxMb: 5 };
    expect(runBuiltInRule(rule, null)).toBeNull();
    expect(runBuiltInRule(rule, undefined)).toBeNull();
  });

  it("passes when value has no size property", () => {
    const rule = { type: "fileSize" as const, maxMb: 5 };
    expect(runBuiltInRule(rule, { name: "file.pdf" })).toBeNull();
  });
});

// ---- fileType ----

describe("fileType validator", () => {
  it("passes when file type matches exactly", () => {
    const rule = { type: "fileType" as const, accept: ["application/pdf"] };
    expect(runBuiltInRule(rule, { type: "application/pdf" })).toBeNull();
  });

  it("passes when file type matches wildcard", () => {
    const rule = { type: "fileType" as const, accept: ["image/*"] };
    expect(runBuiltInRule(rule, { type: "image/png" })).toBeNull();
    expect(runBuiltInRule(rule, { type: "image/jpeg" })).toBeNull();
  });

  it("fails when file type does not match", () => {
    const rule = { type: "fileType" as const, accept: ["image/*", "application/pdf"] };
    expect(runBuiltInRule(rule, { type: "text/plain" })).toBe(
      "File type must be one of: image/*, application/pdf"
    );
  });

  it("passes for multiple accept patterns", () => {
    const rule = { type: "fileType" as const, accept: ["image/*", "application/pdf"] };
    expect(runBuiltInRule(rule, { type: "image/png" })).toBeNull();
    expect(runBuiltInRule(rule, { type: "application/pdf" })).toBeNull();
  });

  it("passes for empty values", () => {
    const rule = { type: "fileType" as const, accept: ["image/*"] };
    expect(runBuiltInRule(rule, null)).toBeNull();
  });

  it("passes when value has no type property", () => {
    const rule = { type: "fileType" as const, accept: ["image/*"] };
    expect(runBuiltInRule(rule, { size: 1024 })).toBeNull();
  });
});

// ---- dispatcher behavior ----

describe("runBuiltInRule dispatcher", () => {
  it("returns null for custom rule type", () => {
    const rule = { type: "custom" as const, name: "myValidator" };
    expect(runBuiltInRule(rule, "anything")).toBeNull();
  });

  it("returns null for async rule type", () => {
    const rule = { type: "async" as const, name: "serverCheck", endpoint: "/api/check" };
    expect(runBuiltInRule(rule, "anything")).toBeNull();
  });

  it("returns null for unknown rule type", () => {
    // @ts-expect-error — testing unknown type
    expect(runBuiltInRule({ type: "nonexistent" }, "value")).toBeNull();
  });
});
