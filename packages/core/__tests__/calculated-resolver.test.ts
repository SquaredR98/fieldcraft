import { describe, it, expect } from "vitest";
import { evaluateExpression, extractFieldRefs } from "../src/engine/calculated-resolver";

describe("evaluateExpression", () => {
  it("simple addition", () => {
    expect(evaluateExpression("{a} + {b}", { a: 3, b: 5 })).toBe(8);
  });

  it("multiplication", () => {
    expect(evaluateExpression("{qty} * {price}", { qty: 4, price: 10 })).toBe(40);
  });

  it("complex expression with parentheses", () => {
    expect(evaluateExpression("{subtotal} * (1 + {tax} / 100)", { subtotal: 100, tax: 8 })).toBe(108);
  });

  it("power operator", () => {
    expect(evaluateExpression("{x} ^ 2", { x: 5 })).toBe(25);
  });

  it("BMI formula", () => {
    // BMI = weight * 703 / height^2
    const result = evaluateExpression("{weight} * 703 / ({height} ^ 2)", { weight: 150, height: 65 });
    expect(result).toBeCloseTo(24.96, 1);
  });

  it("returns null when referenced field is missing", () => {
    expect(evaluateExpression("{a} + {b}", { a: 3 })).toBeNull();
  });

  it("returns null when referenced field is null", () => {
    expect(evaluateExpression("{a} + {b}", { a: 3, b: null })).toBeNull();
  });

  it("returns null when referenced field is non-numeric", () => {
    expect(evaluateExpression("{a} + {b}", { a: 3, b: "hello" })).toBeNull();
  });

  it("handles string numeric values", () => {
    expect(evaluateExpression("{a} + {b}", { a: "3", b: "5" })).toBe(8);
  });

  it("handles negative numbers", () => {
    expect(evaluateExpression("{a} + {b}", { a: -3, b: 5 })).toBe(2);
  });

  it("handles division by zero gracefully", () => {
    const result = evaluateExpression("{a} / {b}", { a: 5, b: 0 });
    expect(result).toBeNaN();
  });

  it("handles no field references (pure math)", () => {
    expect(evaluateExpression("2 + 3 * 4", {})).toBe(14);
  });

  it("returns null for invalid expression", () => {
    expect(evaluateExpression("{a} +++ {b}", { a: 1, b: 2 })).toBeNull();
  });
});

describe("extractFieldRefs", () => {
  it("extracts single field reference", () => {
    expect(extractFieldRefs("{name}")).toEqual(["name"]);
  });

  it("extracts multiple field references", () => {
    expect(extractFieldRefs("{a} + {b} * {c}")).toEqual(["a", "b", "c"]);
  });

  it("deduplicates field references", () => {
    expect(extractFieldRefs("{a} + {a}")).toEqual(["a"]);
  });

  it("returns empty for no references", () => {
    expect(extractFieldRefs("2 + 3")).toEqual([]);
  });
});
