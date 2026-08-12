import { describe, it, expect } from "vitest";
import { evaluateExpression, extractFieldRefs } from "../src/engine/calculated-resolver";

describe("evaluateExpression", () => {
  it("simple addition", () => {
    const result = evaluateExpression("{a} + {b}", { a: 3, b: 5 });
    expect(result.value).toBe(8);
    expect(result.warning).toBeUndefined();
  });

  it("multiplication", () => {
    const result = evaluateExpression("{qty} * {price}", { qty: 4, price: 10 });
    expect(result.value).toBe(40);
    expect(result.warning).toBeUndefined();
  });

  it("complex expression with parentheses", () => {
    const result = evaluateExpression("{subtotal} * (1 + {tax} / 100)", { subtotal: 100, tax: 8 });
    expect(result.value).toBe(108);
    expect(result.warning).toBeUndefined();
  });

  it("power operator", () => {
    const result = evaluateExpression("{x} ^ 2", { x: 5 });
    expect(result.value).toBe(25);
    expect(result.warning).toBeUndefined();
  });

  it("BMI formula", () => {
    const result = evaluateExpression("{weight} * 703 / ({height} ^ 2)", { weight: 150, height: 65 });
    expect(result.value).toBeCloseTo(24.96, 1);
    expect(result.warning).toBeUndefined();
  });

  it("returns null with warning when referenced field is missing", () => {
    const result = evaluateExpression("{a} + {b}", { a: 3 });
    expect(result.value).toBeNull();
    expect(result.warning).toContain("{b}");
    expect(result.warning).toContain("no value");
  });

  it("returns null with warning when referenced field is null", () => {
    const result = evaluateExpression("{a} + {b}", { a: 3, b: null });
    expect(result.value).toBeNull();
    expect(result.warning).toContain("{b}");
    expect(result.warning).toContain("no value");
  });

  it("returns null with warning when referenced field is non-numeric", () => {
    const result = evaluateExpression("{a} + {b}", { a: 3, b: "hello" });
    expect(result.value).toBeNull();
    expect(result.warning).toContain("{b}");
    expect(result.warning).toContain("not a number");
    expect(result.warning).toContain("hello");
  });

  it("handles string numeric values", () => {
    const result = evaluateExpression("{a} + {b}", { a: "3", b: "5" });
    expect(result.value).toBe(8);
    expect(result.warning).toBeUndefined();
  });

  it("handles negative numbers", () => {
    const result = evaluateExpression("{a} + {b}", { a: -3, b: 5 });
    expect(result.value).toBe(2);
    expect(result.warning).toBeUndefined();
  });

  it("returns null with warning on division by zero", () => {
    const result = evaluateExpression("{a} / {b}", { a: 5, b: 0 });
    expect(result.value).toBeNull();
    expect(result.warning).toBeDefined();
    expect(result.warning!.toLowerCase()).toContain("division by zero");
  });

  it("handles no field references (pure math)", () => {
    const result = evaluateExpression("2 + 3 * 4", {});
    expect(result.value).toBe(14);
    expect(result.warning).toBeUndefined();
  });

  it("returns null with warning for malformed expression", () => {
    const result = evaluateExpression("{a} +++ {b}", { a: 1, b: 2 });
    expect(result.value).toBeNull();
    expect(result.warning).toContain("invalid");
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
