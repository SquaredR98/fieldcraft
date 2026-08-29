import { describe, it, expect } from "vitest";
import { formatPhone, formatCurrency, formatFileSize, truncate } from "../../src/utils/format-helpers";

// ---- formatPhone ----

describe("formatPhone", () => {
  it("formats 10-digit number as (123) 456-7890", () => {
    expect(formatPhone("1234567890")).toBe("(123) 456-7890");
  });

  it("handles partial: 3 digits", () => {
    expect(formatPhone("123")).toBe("123");
  });

  it("handles partial: 4 digits", () => {
    expect(formatPhone("1234")).toBe("(123) 4");
  });

  it("handles partial: 6 digits", () => {
    expect(formatPhone("123456")).toBe("(123) 456");
  });

  it("handles partial: 7 digits", () => {
    expect(formatPhone("1234567")).toBe("(123) 456-7");
  });

  it("strips non-digit characters before formatting", () => {
    expect(formatPhone("(123) 456-7890")).toBe("(123) 456-7890");
    expect(formatPhone("123-456-7890")).toBe("(123) 456-7890");
    expect(formatPhone("+1 234 567 8901")).toBe("(123) 456-7890");
  });

  it("handles empty string", () => {
    expect(formatPhone("")).toBe("");
  });

  it("handles 1-2 digits", () => {
    expect(formatPhone("1")).toBe("1");
    expect(formatPhone("12")).toBe("12");
  });

  it("truncates to 10 digits max", () => {
    // 11+ digits — only first 10 in output
    expect(formatPhone("12345678901")).toBe("(123) 456-7890");
  });
});

// ---- formatCurrency ----

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain("1,234.56");
    expect(result).toContain("$");
  });

  it("formats zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0.00");
  });

  it("formats negative amounts", () => {
    const result = formatCurrency(-99.99);
    expect(result).toContain("99.99");
  });

  it("accepts different currency codes", () => {
    const result = formatCurrency(100, "EUR", "en-US");
    expect(result).toContain("100.00");
  });

  it("large numbers with commas", () => {
    const result = formatCurrency(1000000);
    expect(result).toContain("1,000,000");
  });
});

// ---- formatFileSize ----

describe("formatFileSize", () => {
  it("formats 0 bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("formats bytes (< 1 KB)", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });

  it("formats kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(1048576)).toBe("1.0 MB");
    expect(formatFileSize(1572864)).toBe("1.5 MB");
  });

  it("formats gigabytes", () => {
    expect(formatFileSize(1073741824)).toBe("1.0 GB");
  });

  it("formats fractional sizes", () => {
    expect(formatFileSize(2560)).toBe("2.5 KB");
  });

  it("handles 1 byte", () => {
    expect(formatFileSize(1)).toBe("1 B");
  });
});

// ---- truncate ----

describe("truncate", () => {
  it("returns text unchanged if within limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("truncates text exceeding limit with ellipsis", () => {
    const result = truncate("hello world", 5);
    expect(result).toBe("hell\u2026");
    expect(result.length).toBe(5);
  });

  it("handles empty string", () => {
    expect(truncate("", 5)).toBe("");
  });

  it("handles maxLength of 1", () => {
    expect(truncate("hello", 1)).toBe("\u2026");
  });

  it("handles exact length match", () => {
    expect(truncate("abc", 3)).toBe("abc");
  });

  it("truncates at maxLength - 1 chars + ellipsis", () => {
    const result = truncate("abcdefgh", 4);
    expect(result).toBe("abc\u2026");
  });
});
