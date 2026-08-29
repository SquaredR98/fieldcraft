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

describe("evaluateExpression — repeater aggregates", () => {
  const values = {
    items: [
      { name: "Widget", price: 10, qty: 3 },
      { name: "Gadget", price: 25, qty: 2 },
      { name: "Doohickey", price: 5, qty: 10 },
    ],
  };

  it("SUM of a single repeater sub-field", () => {
    const result = evaluateExpression("SUM({items.price})", values);
    expect(result.value).toBe(40); // 10 + 25 + 5
    expect(result.warning).toBeUndefined();
  });

  it("SUM of product expression across repeater rows", () => {
    const result = evaluateExpression("SUM({items.price} * {items.qty})", values);
    expect(result.value).toBe(130); // (10*3) + (25*2) + (5*10) = 30 + 50 + 50
    expect(result.warning).toBeUndefined();
  });

  it("AVG of a repeater sub-field", () => {
    const result = evaluateExpression("AVG({items.price})", values);
    expect(result.value).toBeCloseTo(13.33, 1); // (10+25+5)/3
    expect(result.warning).toBeUndefined();
  });

  it("COUNT of a repeater sub-field", () => {
    const result = evaluateExpression("COUNT({items.price})", values);
    expect(result.value).toBe(3);
    expect(result.warning).toBeUndefined();
  });

  it("MIN of a repeater sub-field", () => {
    const result = evaluateExpression("MIN({items.price})", values);
    expect(result.value).toBe(5);
    expect(result.warning).toBeUndefined();
  });

  it("MAX of a repeater sub-field", () => {
    const result = evaluateExpression("MAX({items.qty})", values);
    expect(result.value).toBe(10);
    expect(result.warning).toBeUndefined();
  });

  it("aggregate combined with simple field ref", () => {
    const result = evaluateExpression("SUM({items.price} * {items.qty}) * 1.085", values);
    expect(result.value).toBeCloseTo(141.05, 1); // 130 * 1.085
    expect(result.warning).toBeUndefined();
  });

  it("returns 0 for SUM of empty repeater", () => {
    const result = evaluateExpression("SUM({items.price})", { items: [] });
    expect(result.value).toBe(0);
    expect(result.warning).toBeUndefined();
  });

  it("returns 0 for SUM when repeater is not an array", () => {
    const result = evaluateExpression("SUM({items.price})", { items: "not-an-array" });
    expect(result.value).toBe(0);
    expect(result.warning).toBeUndefined();
  });

  it("chained calculation: SUM feeds into another calculated field", () => {
    const vals = {
      items: [
        { price: 10, qty: 2 },
        { price: 20, qty: 1 },
      ],
      subtotal: 40, // pre-computed: SUM(price*qty) = 20 + 20 = 40
    };
    const result = evaluateExpression("{subtotal} * 0.085", vals);
    expect(result.value).toBeCloseTo(3.4, 1);
    expect(result.warning).toBeUndefined();
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

  it("extracts repeater parent IDs from dot-notation refs", () => {
    const refs = extractFieldRefs("SUM({items.price} * {items.qty})");
    expect(refs).toContain("items");
  });

  it("extracts both simple and repeater refs", () => {
    const refs = extractFieldRefs("SUM({items.price}) + {tax_rate}");
    expect(refs).toContain("items");
    expect(refs).toContain("tax_rate");
  });
});

// ---- Edge cases for OSS fixes ----

describe("evaluateExpression — edge cases", () => {
  it("rejects expressions exceeding MAX_EXPRESSION_LENGTH (10,000 chars)", () => {
    const longExpr = "{a} + " + "1 + ".repeat(3000) + "0";
    expect(longExpr.length).toBeGreaterThan(10_000);
    const result = evaluateExpression(longExpr, { a: 1 });
    expect(result.value).toBeNull();
    expect(result.warning).toContain("maximum length");
  });

  it("accepts expressions just under the length limit", () => {
    const expr = "{a} + " + "1 + ".repeat(2490) + "0"; // ~9,966 chars
    expect(expr.length).toBeLessThan(10_000);
    const result = evaluateExpression(expr, { a: 0 });
    expect(result.value).toBeTypeOf("number");
    expect(result.warning).toBeUndefined();
  });

  it("handles hyphenated field IDs", () => {
    const result = evaluateExpression("{my-field} + {other-field}", { "my-field": 10, "other-field": 5 });
    expect(result.value).toBe(15);
    expect(result.warning).toBeUndefined();
  });

  it("handles hyphenated field IDs in repeater aggregates", () => {
    const values = {
      "line-items": [
        { "unit-price": 10, qty: 2 },
        { "unit-price": 20, qty: 3 },
      ],
    };
    const result = evaluateExpression("SUM({line-items.unit-price})", values);
    expect(result.value).toBe(30);
    expect(result.warning).toBeUndefined();
  });

  it("handles hyphenated IDs in complex repeater aggregates", () => {
    const values = {
      "order-items": [
        { "unit-price": 10, "item-qty": 3 },
        { "unit-price": 25, "item-qty": 2 },
      ],
    };
    const result = evaluateExpression("SUM({order-items.unit-price} * {order-items.item-qty})", values);
    expect(result.value).toBe(80); // (10*3) + (25*2)
    expect(result.warning).toBeUndefined();
  });

  it("handles underscore-only field IDs", () => {
    const result = evaluateExpression("{field_a} + {field_b}", { field_a: 7, field_b: 3 });
    expect(result.value).toBe(10);
  });

  it("returns null for empty expression", () => {
    const result = evaluateExpression("", {});
    expect(result.value).toBeNull();
  });

  it("handles modulo operator", () => {
    const result = evaluateExpression("{a} % {b}", { a: 10, b: 3 });
    expect(result.value).toBe(1);
  });

  it("returns warning when aggregate references multiple repeaters", () => {
    const values = {
      items: [{ price: 10 }],
      other: [{ qty: 5 }],
    };
    const result = evaluateExpression("SUM({items.price} * {other.qty})", values);
    expect(result.value).toBeNull();
    expect(result.warning).toContain("multiple repeaters");
  });
});
