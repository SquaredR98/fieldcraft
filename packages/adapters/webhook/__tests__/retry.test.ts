import { describe, it, expect } from "vitest";
import { calculateDelay } from "../src/retry";

describe("calculateDelay", () => {
  it("linear: returns baseDelay * attempt", () => {
    expect(calculateDelay(1, 1000, "linear")).toBe(1000);
    expect(calculateDelay(2, 1000, "linear")).toBe(2000);
    expect(calculateDelay(3, 1000, "linear")).toBe(3000);
  });

  it("exponential: returns roughly baseDelay * 2^(attempt-1)", () => {
    const d1 = calculateDelay(1, 1000, "exponential");
    const d2 = calculateDelay(2, 1000, "exponential");
    const d3 = calculateDelay(3, 1000, "exponential");

    // Allow 10% jitter
    expect(d1).toBeGreaterThanOrEqual(1000);
    expect(d1).toBeLessThanOrEqual(1100);
    expect(d2).toBeGreaterThanOrEqual(2000);
    expect(d2).toBeLessThanOrEqual(2200);
    expect(d3).toBeGreaterThanOrEqual(4000);
    expect(d3).toBeLessThanOrEqual(4400);
  });
});
