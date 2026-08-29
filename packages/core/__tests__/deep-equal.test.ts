import { describe, it, expect } from "vitest";
import { deepEqual } from "../src/utils/deep-equal";

describe("deepEqual", () => {
  // ---- Primitive values ----

  it("equal numbers", () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual(0, 0)).toBe(true);
    expect(deepEqual(-1, -1)).toBe(true);
    expect(deepEqual(3.14, 3.14)).toBe(true);
  });

  it("different numbers", () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual(0, 1)).toBe(false);
    expect(deepEqual(-1, 1)).toBe(false);
  });

  it("equal strings", () => {
    expect(deepEqual("hello", "hello")).toBe(true);
    expect(deepEqual("", "")).toBe(true);
  });

  it("different strings", () => {
    expect(deepEqual("hello", "world")).toBe(false);
    expect(deepEqual("", "a")).toBe(false);
  });

  it("equal booleans", () => {
    expect(deepEqual(true, true)).toBe(true);
    expect(deepEqual(false, false)).toBe(true);
  });

  it("different booleans", () => {
    expect(deepEqual(true, false)).toBe(false);
  });

  it("undefined === undefined", () => {
    expect(deepEqual(undefined, undefined)).toBe(true);
  });

  it("null === null", () => {
    expect(deepEqual(null, null)).toBe(true);
  });

  // ---- Null handling ----

  it("null vs non-null returns false", () => {
    expect(deepEqual(null, 0)).toBe(false);
    expect(deepEqual(null, "")).toBe(false);
    expect(deepEqual(null, false)).toBe(false);
    expect(deepEqual(null, {})).toBe(false);
    expect(deepEqual(null, [])).toBe(false);
  });

  it("non-null vs null returns false", () => {
    expect(deepEqual(0, null)).toBe(false);
    expect(deepEqual("", null)).toBe(false);
    expect(deepEqual({}, null)).toBe(false);
  });

  it("null vs undefined returns false", () => {
    // null === undefined via ===? No, they aren't ===
    // a === b → false, then a === null → true, returns false
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(undefined, null)).toBe(false);
  });

  // ---- Type mismatch ----

  it("different types return false", () => {
    expect(deepEqual(1, "1")).toBe(false);
    expect(deepEqual(0, false)).toBe(false);
    expect(deepEqual("", 0)).toBe(false);
    expect(deepEqual(true, 1)).toBe(false);
    expect(deepEqual(1, [1])).toBe(false);
    expect(deepEqual("a", ["a"])).toBe(false);
  });

  // ---- Arrays ----

  it("equal arrays", () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual(["a", "b"], ["a", "b"])).toBe(true);
    expect(deepEqual([], [])).toBe(true);
  });

  it("different length arrays", () => {
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(deepEqual([1], [])).toBe(false);
  });

  it("same length, different values", () => {
    expect(deepEqual([1, 2], [1, 3])).toBe(false);
    expect(deepEqual(["a"], ["b"])).toBe(false);
  });

  it("nested arrays", () => {
    expect(deepEqual([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true);
    expect(deepEqual([[1, 2], [3, 4]], [[1, 2], [3, 5]])).toBe(false);
  });

  it("array vs non-array object", () => {
    expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
    expect(deepEqual({ 0: 1, 1: 2 }, [1, 2])).toBe(false);
  });

  // ---- Objects ----

  it("equal objects", () => {
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(deepEqual({}, {})).toBe(true);
  });

  it("different key counts", () => {
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
  });

  it("same keys, different values", () => {
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it("different keys, same count", () => {
    expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it("nested objects", () => {
    const a = { user: { name: "John", address: { city: "NYC" } } };
    const b = { user: { name: "John", address: { city: "NYC" } } };
    const c = { user: { name: "John", address: { city: "LA" } } };
    expect(deepEqual(a, b)).toBe(true);
    expect(deepEqual(a, c)).toBe(false);
  });

  it("objects with array values", () => {
    expect(deepEqual({ tags: [1, 2] }, { tags: [1, 2] })).toBe(true);
    expect(deepEqual({ tags: [1, 2] }, { tags: [1, 3] })).toBe(false);
  });

  // ---- Same reference ----

  it("same reference returns true", () => {
    const obj = { a: 1 };
    expect(deepEqual(obj, obj)).toBe(true);
    const arr = [1, 2, 3];
    expect(deepEqual(arr, arr)).toBe(true);
  });

  // ---- Mixed nesting ----

  it("deeply nested mixed structures", () => {
    const a = {
      sections: [
        { id: "s1", questions: [{ id: "q1", options: [{ label: "A" }] }] },
      ],
    };
    const b = {
      sections: [
        { id: "s1", questions: [{ id: "q1", options: [{ label: "A" }] }] },
      ],
    };
    expect(deepEqual(a, b)).toBe(true);
  });

  it("deeply nested with one difference", () => {
    const a = {
      sections: [
        { id: "s1", questions: [{ id: "q1", options: [{ label: "A" }] }] },
      ],
    };
    const b = {
      sections: [
        { id: "s1", questions: [{ id: "q1", options: [{ label: "B" }] }] },
      ],
    };
    expect(deepEqual(a, b)).toBe(false);
  });

  // ---- NaN ----

  it("NaN is not equal to NaN (follows ===)", () => {
    // NaN === NaN is false, so a === b returns false
    // Then typeof check: both "number", enters object branch? No — typeof NaN is "number"
    // But NaN is not "object", so falls through to return false
    expect(deepEqual(NaN, NaN)).toBe(false);
  });

  // ---- undefined in object properties ----

  it("key with undefined value vs missing key", () => {
    // { a: undefined } has keysA = ["a"], {} has keysB = []
    // Different key counts → false
    expect(deepEqual({ a: undefined }, {})).toBe(false);
  });
});
