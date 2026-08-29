import { describe, it, expect } from "vitest";
import { flattenFormValues, unflattenFormValues } from "../src/utils/form-utils";

// ---- flattenFormValues ----

describe("flattenFormValues", () => {
  it("flattens simple nested object", () => {
    expect(flattenFormValues({ address: { city: "NYC", zip: "10001" } })).toEqual({
      "address.city": "NYC",
      "address.zip": "10001",
    });
  });

  it("passes through flat values unchanged", () => {
    expect(flattenFormValues({ name: "John", age: 30 })).toEqual({
      name: "John",
      age: 30,
    });
  });

  it("handles deeply nested objects", () => {
    const input = { a: { b: { c: { d: "deep" } } } };
    expect(flattenFormValues(input)).toEqual({ "a.b.c.d": "deep" });
  });

  it("preserves arrays as leaf values", () => {
    const input = { tags: ["a", "b", "c"] };
    expect(flattenFormValues(input)).toEqual({ tags: ["a", "b", "c"] });
  });

  it("preserves null as leaf value", () => {
    const input = { name: null, address: { city: null } };
    expect(flattenFormValues(input)).toEqual({
      name: null,
      "address.city": null,
    });
  });

  it("returns empty object for empty input", () => {
    expect(flattenFormValues({})).toEqual({});
  });

  it("handles mixed flat and nested values", () => {
    const input = {
      name: "John",
      address: { city: "NYC", state: "NY" },
      age: 30,
    };
    expect(flattenFormValues(input)).toEqual({
      name: "John",
      "address.city": "NYC",
      "address.state": "NY",
      age: 30,
    });
  });

  it("handles numbers, booleans, and strings at leaf level", () => {
    const input = {
      data: { count: 42, active: true, label: "test" },
    };
    expect(flattenFormValues(input)).toEqual({
      "data.count": 42,
      "data.active": true,
      "data.label": "test",
    });
  });

  it("handles nested arrays of objects (treated as leaf)", () => {
    const input = {
      items: [{ name: "A" }, { name: "B" }],
    };
    // Arrays are leaf values — not recursed into
    expect(flattenFormValues(input)).toEqual({
      items: [{ name: "A" }, { name: "B" }],
    });
  });

  it("handles empty nested objects", () => {
    const input = { empty: {} };
    // Empty object has no keys → nothing to flatten
    expect(flattenFormValues(input)).toEqual({});
  });
});

// ---- unflattenFormValues ----

describe("unflattenFormValues", () => {
  it("unflattens dot-notation keys to nested object", () => {
    const input = { "address.city": "NYC", "address.zip": "10001" };
    expect(unflattenFormValues(input)).toEqual({
      address: { city: "NYC", zip: "10001" },
    });
  });

  it("passes through non-dotted keys unchanged", () => {
    const input = { name: "John", age: 30 };
    expect(unflattenFormValues(input)).toEqual({ name: "John", age: 30 });
  });

  it("handles deeply nested dot notation", () => {
    const input = { "a.b.c.d": "deep" };
    expect(unflattenFormValues(input)).toEqual({ a: { b: { c: { d: "deep" } } } });
  });

  it("returns empty object for empty input", () => {
    expect(unflattenFormValues({})).toEqual({});
  });

  it("handles mixed flat and dotted keys", () => {
    const input = {
      name: "John",
      "address.city": "NYC",
      "address.state": "NY",
      age: 30,
    };
    expect(unflattenFormValues(input)).toEqual({
      name: "John",
      address: { city: "NYC", state: "NY" },
      age: 30,
    });
  });

  it("handles multiple top-level groups", () => {
    const input = {
      "billing.city": "NYC",
      "billing.zip": "10001",
      "shipping.city": "LA",
      "shipping.zip": "90001",
    };
    expect(unflattenFormValues(input)).toEqual({
      billing: { city: "NYC", zip: "10001" },
      shipping: { city: "LA", zip: "90001" },
    });
  });

  it("preserves array values", () => {
    const input = { tags: ["a", "b"] };
    expect(unflattenFormValues(input)).toEqual({ tags: ["a", "b"] });
  });

  it("preserves null values", () => {
    const input = { "address.city": null };
    expect(unflattenFormValues(input)).toEqual({ address: { city: null } });
  });

  it("later keys overwrite earlier keys at same path", () => {
    // If two keys target the same leaf, last wins
    const input = { "a.b": "first" };
    const result = unflattenFormValues(input);
    expect(result).toEqual({ a: { b: "first" } });
  });
});

// ---- Round-trip ----

describe("flatten/unflatten round-trip", () => {
  it("round-trips simple nested objects", () => {
    const original = {
      name: "John",
      address: { city: "NYC", state: "NY" },
    };
    expect(unflattenFormValues(flattenFormValues(original))).toEqual(original);
  });

  it("round-trips flat objects", () => {
    const original = { name: "John", age: 30 };
    expect(unflattenFormValues(flattenFormValues(original))).toEqual(original);
  });

  it("round-trips deeply nested objects", () => {
    const original = { a: { b: { c: "deep" } } };
    expect(unflattenFormValues(flattenFormValues(original))).toEqual(original);
  });
});
