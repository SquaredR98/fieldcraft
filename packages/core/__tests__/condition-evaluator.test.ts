import { describe, it, expect } from "vitest";
import { evaluate } from "../src/engine/condition-evaluator";
import type { ConditionExpression } from "../src/types/conditions";

describe("condition-evaluator", () => {
  // ---- Empty / undefined expressions ----

  it("returns true for empty object", () => {
    expect(evaluate({}, {})).toBe(true);
  });

  it("returns true for undefined-like expression", () => {
    expect(evaluate({} as ConditionExpression, {})).toBe(true);
  });

  // ---- eq operator ----

  it("eq: matches equal strings", () => {
    expect(evaluate({ field: "name", operator: "eq", value: "John" }, { name: "John" })).toBe(true);
  });

  it("eq: rejects different strings", () => {
    expect(evaluate({ field: "name", operator: "eq", value: "John" }, { name: "Jane" })).toBe(false);
  });

  it("eq: matches equal numbers", () => {
    expect(evaluate({ field: "age", operator: "eq", value: 25 }, { age: 25 })).toBe(true);
  });

  it("eq: matches equal booleans", () => {
    expect(evaluate({ field: "consent", operator: "eq", value: true }, { consent: true })).toBe(true);
  });

  it("eq: strict equality (string '25' != number 25)", () => {
    expect(evaluate({ field: "age", operator: "eq", value: 25 }, { age: "25" })).toBe(false);
  });

  // ---- neq operator ----

  it("neq: different values", () => {
    expect(evaluate({ field: "status", operator: "neq", value: "inactive" }, { status: "active" })).toBe(true);
  });

  it("neq: same values", () => {
    expect(evaluate({ field: "status", operator: "neq", value: "active" }, { status: "active" })).toBe(false);
  });

  // ---- gt / gte / lt / lte operators ----

  it("gt: greater than", () => {
    expect(evaluate({ field: "score", operator: "gt", value: 10 }, { score: 15 })).toBe(true);
    expect(evaluate({ field: "score", operator: "gt", value: 10 }, { score: 10 })).toBe(false);
    expect(evaluate({ field: "score", operator: "gt", value: 10 }, { score: 5 })).toBe(false);
  });

  it("gte: greater than or equal", () => {
    expect(evaluate({ field: "score", operator: "gte", value: 10 }, { score: 10 })).toBe(true);
    expect(evaluate({ field: "score", operator: "gte", value: 10 }, { score: 11 })).toBe(true);
    expect(evaluate({ field: "score", operator: "gte", value: 10 }, { score: 9 })).toBe(false);
  });

  it("lt: less than", () => {
    expect(evaluate({ field: "score", operator: "lt", value: 10 }, { score: 5 })).toBe(true);
    expect(evaluate({ field: "score", operator: "lt", value: 10 }, { score: 10 })).toBe(false);
  });

  it("lte: less than or equal", () => {
    expect(evaluate({ field: "score", operator: "lte", value: 10 }, { score: 10 })).toBe(true);
    expect(evaluate({ field: "score", operator: "lte", value: 10 }, { score: 9 })).toBe(true);
    expect(evaluate({ field: "score", operator: "lte", value: 10 }, { score: 11 })).toBe(false);
  });

  it("numeric operators coerce strings to numbers", () => {
    expect(evaluate({ field: "age", operator: "gt", value: 18 }, { age: "25" })).toBe(true);
    expect(evaluate({ field: "age", operator: "lt", value: 18 }, { age: "10" })).toBe(true);
  });

  // ---- in / notIn operators ----

  it("in: value in array", () => {
    expect(evaluate({ field: "country", operator: "in", value: ["US", "CA", "UK"] }, { country: "US" })).toBe(true);
    expect(evaluate({ field: "country", operator: "in", value: ["US", "CA", "UK"] }, { country: "DE" })).toBe(false);
  });

  it("in: returns false if conditionValue is not an array", () => {
    expect(evaluate({ field: "x", operator: "in", value: "not-array" }, { x: "a" })).toBe(false);
  });

  it("notIn: value not in array", () => {
    expect(evaluate({ field: "role", operator: "notIn", value: ["admin", "super"] }, { role: "user" })).toBe(true);
    expect(evaluate({ field: "role", operator: "notIn", value: ["admin", "super"] }, { role: "admin" })).toBe(false);
  });

  // ---- exists / notExists operators ----

  it("exists: field has a value", () => {
    expect(evaluate({ field: "email", operator: "exists" }, { email: "a@b.com" })).toBe(true);
    expect(evaluate({ field: "email", operator: "exists" }, { email: "" })).toBe(false);
    expect(evaluate({ field: "email", operator: "exists" }, { email: null })).toBe(false);
    expect(evaluate({ field: "email", operator: "exists" }, {})).toBe(false);
  });

  it("exists: 0 and false are considered existing values", () => {
    expect(evaluate({ field: "count", operator: "exists" }, { count: 0 })).toBe(true);
    expect(evaluate({ field: "flag", operator: "exists" }, { flag: false })).toBe(true);
  });

  it("notExists: field is empty", () => {
    expect(evaluate({ field: "phone", operator: "notExists" }, {})).toBe(true);
    expect(evaluate({ field: "phone", operator: "notExists" }, { phone: null })).toBe(true);
    expect(evaluate({ field: "phone", operator: "notExists" }, { phone: "" })).toBe(true);
    expect(evaluate({ field: "phone", operator: "notExists" }, { phone: "123" })).toBe(false);
  });

  // ---- contains / notContains operators ----

  it("contains: string contains substring", () => {
    expect(evaluate({ field: "name", operator: "contains", value: "Jr" }, { name: "John Jr" })).toBe(true);
    expect(evaluate({ field: "name", operator: "contains", value: "Jr" }, { name: "John" })).toBe(false);
  });

  it("notContains: string does not contain", () => {
    expect(evaluate({ field: "email", operator: "notContains", value: "spam" }, { email: "user@example.com" })).toBe(true);
    expect(evaluate({ field: "email", operator: "notContains", value: "spam" }, { email: "spam@test.com" })).toBe(false);
  });

  // ---- startsWith / endsWith operators ----

  it("startsWith: string starts with prefix", () => {
    expect(evaluate({ field: "code", operator: "startsWith", value: "PRJ-" }, { code: "PRJ-123" })).toBe(true);
    expect(evaluate({ field: "code", operator: "startsWith", value: "PRJ-" }, { code: "TSK-123" })).toBe(false);
  });

  it("endsWith: string ends with suffix", () => {
    expect(evaluate({ field: "file", operator: "endsWith", value: ".pdf" }, { file: "doc.pdf" })).toBe(true);
    expect(evaluate({ field: "file", operator: "endsWith", value: ".pdf" }, { file: "doc.docx" })).toBe(false);
  });

  // ---- between operator ----

  it("between: value in range", () => {
    expect(evaluate({ field: "age", operator: "between", value: [18, 65] }, { age: 25 })).toBe(true);
    expect(evaluate({ field: "age", operator: "between", value: [18, 65] }, { age: 18 })).toBe(true);
    expect(evaluate({ field: "age", operator: "between", value: [18, 65] }, { age: 65 })).toBe(true);
    expect(evaluate({ field: "age", operator: "between", value: [18, 65] }, { age: 10 })).toBe(false);
    expect(evaluate({ field: "age", operator: "between", value: [18, 65] }, { age: 70 })).toBe(false);
  });

  it("between: returns false for non-array conditionValue", () => {
    expect(evaluate({ field: "x", operator: "between", value: 5 }, { x: 3 })).toBe(false);
  });

  // ---- matches operator ----

  it("matches: regex match", () => {
    expect(evaluate({ field: "phone", operator: "matches", value: "^\\+1" }, { phone: "+1234567890" })).toBe(true);
    expect(evaluate({ field: "phone", operator: "matches", value: "^\\+1" }, { phone: "+4412345678" })).toBe(false);
  });

  it("matches: returns false for invalid regex", () => {
    expect(evaluate({ field: "x", operator: "matches", value: "[invalid" }, { x: "test" })).toBe(false);
  });

  // ---- Missing field in values ----

  it("missing field treated as undefined", () => {
    expect(evaluate({ field: "nonexistent", operator: "eq", value: undefined }, {})).toBe(true);
    expect(evaluate({ field: "nonexistent", operator: "eq", value: "hello" }, {})).toBe(false);
    expect(evaluate({ field: "nonexistent", operator: "notExists" }, {})).toBe(true);
  });

  // ---- AND / OR grouping ----

  it("AND: all conditions must be true", () => {
    const expr: ConditionExpression = {
      combine: "AND",
      conditions: [
        { field: "age", operator: "gte", value: 18 },
        { field: "consent", operator: "eq", value: true },
      ],
    };
    expect(evaluate(expr, { age: 25, consent: true })).toBe(true);
    expect(evaluate(expr, { age: 25, consent: false })).toBe(false);
    expect(evaluate(expr, { age: 15, consent: true })).toBe(false);
  });

  it("OR: at least one condition must be true", () => {
    const expr: ConditionExpression = {
      combine: "OR",
      conditions: [
        { field: "role", operator: "eq", value: "admin" },
        { field: "role", operator: "eq", value: "super" },
      ],
    };
    expect(evaluate(expr, { role: "admin" })).toBe(true);
    expect(evaluate(expr, { role: "super" })).toBe(true);
    expect(evaluate(expr, { role: "user" })).toBe(false);
  });

  it("default combine is AND", () => {
    const expr: ConditionExpression = {
      conditions: [
        { field: "a", operator: "eq", value: 1 },
        { field: "b", operator: "eq", value: 2 },
      ],
    };
    expect(evaluate(expr, { a: 1, b: 2 })).toBe(true);
    expect(evaluate(expr, { a: 1, b: 3 })).toBe(false);
  });

  // ---- Deeply nested conditions ----

  it("nested: (US AND age >= 21) OR (not US AND age >= 18)", () => {
    const expr: ConditionExpression = {
      combine: "OR",
      conditions: [
        {
          combine: "AND",
          conditions: [
            { field: "country", operator: "eq", value: "US" },
            { field: "age", operator: "gte", value: 21 },
          ],
        },
        {
          combine: "AND",
          conditions: [
            { field: "country", operator: "neq", value: "US" },
            { field: "age", operator: "gte", value: 18 },
          ],
        },
      ],
    };

    expect(evaluate(expr, { country: "US", age: 21 })).toBe(true);
    expect(evaluate(expr, { country: "US", age: 18 })).toBe(false);
    expect(evaluate(expr, { country: "UK", age: 18 })).toBe(true);
    expect(evaluate(expr, { country: "UK", age: 15 })).toBe(false);
  });

  // ---- matchesRegex operator ----

  it("matchesRegex: regex match (alias for matches)", () => {
    expect(evaluate({ field: "zip", operator: "matchesRegex", value: "^\\d{5}$" }, { zip: "10001" })).toBe(true);
    expect(evaluate({ field: "zip", operator: "matchesRegex", value: "^\\d{5}$" }, { zip: "1000" })).toBe(false);
  });

  it("matchesRegex: returns false for invalid regex", () => {
    expect(evaluate({ field: "x", operator: "matchesRegex", value: "[unclosed" }, { x: "test" })).toBe(false);
  });

  it("matchesRegex: coerces non-string field values", () => {
    expect(evaluate({ field: "num", operator: "matchesRegex", value: "^42$" }, { num: 42 })).toBe(true);
  });

  // ---- dateAfter / dateBefore operators ----

  it("dateAfter: field date is after condition date", () => {
    expect(evaluate({ field: "d", operator: "dateAfter", value: "2024-01-01" }, { d: "2024-06-15" })).toBe(true);
    expect(evaluate({ field: "d", operator: "dateAfter", value: "2024-06-15" }, { d: "2024-01-01" })).toBe(false);
  });

  it("dateAfter: equal dates return false (strictly after)", () => {
    expect(evaluate({ field: "d", operator: "dateAfter", value: "2024-01-01" }, { d: "2024-01-01" })).toBe(false);
  });

  it("dateAfter: returns false for invalid field date", () => {
    expect(evaluate({ field: "d", operator: "dateAfter", value: "2024-01-01" }, { d: "not-a-date" })).toBe(false);
  });

  it("dateAfter: returns false for invalid condition date", () => {
    expect(evaluate({ field: "d", operator: "dateAfter", value: "not-a-date" }, { d: "2024-01-01" })).toBe(false);
  });

  it("dateAfter: returns false when field value is null", () => {
    expect(evaluate({ field: "d", operator: "dateAfter", value: "2024-01-01" }, { d: null })).toBe(false);
  });

  it("dateBefore: field date is before condition date", () => {
    expect(evaluate({ field: "d", operator: "dateBefore", value: "2024-06-15" }, { d: "2024-01-01" })).toBe(true);
    expect(evaluate({ field: "d", operator: "dateBefore", value: "2024-01-01" }, { d: "2024-06-15" })).toBe(false);
  });

  it("dateBefore: equal dates return false (strictly before)", () => {
    expect(evaluate({ field: "d", operator: "dateBefore", value: "2024-01-01" }, { d: "2024-01-01" })).toBe(false);
  });

  it("dateBefore: returns false for invalid dates", () => {
    expect(evaluate({ field: "d", operator: "dateBefore", value: "invalid" }, { d: "2024-01-01" })).toBe(false);
    expect(evaluate({ field: "d", operator: "dateBefore", value: "2024-01-01" }, { d: "invalid" })).toBe(false);
  });

  it("dateAfter: works with ISO 8601 timestamps", () => {
    expect(evaluate(
      { field: "d", operator: "dateAfter", value: "2024-01-01T00:00:00Z" },
      { d: "2024-01-01T12:00:00Z" },
    )).toBe(true);
  });

  // ---- arrayContains / arrayNotContains operators ----

  it("arrayContains: array field contains value", () => {
    expect(evaluate({ field: "tags", operator: "arrayContains", value: "web" }, { tags: ["web", "mobile"] })).toBe(true);
    expect(evaluate({ field: "tags", operator: "arrayContains", value: "desktop" }, { tags: ["web", "mobile"] })).toBe(false);
  });

  it("arrayContains: returns false for non-array field", () => {
    expect(evaluate({ field: "name", operator: "arrayContains", value: "a" }, { name: "abc" })).toBe(false);
    expect(evaluate({ field: "num", operator: "arrayContains", value: 1 }, { num: 1 })).toBe(false);
  });

  it("arrayContains: works with number arrays", () => {
    expect(evaluate({ field: "ids", operator: "arrayContains", value: 3 }, { ids: [1, 2, 3] })).toBe(true);
    expect(evaluate({ field: "ids", operator: "arrayContains", value: 4 }, { ids: [1, 2, 3] })).toBe(false);
  });

  it("arrayNotContains: array field does not contain value", () => {
    expect(evaluate({ field: "tags", operator: "arrayNotContains", value: "desktop" }, { tags: ["web", "mobile"] })).toBe(true);
    expect(evaluate({ field: "tags", operator: "arrayNotContains", value: "web" }, { tags: ["web", "mobile"] })).toBe(false);
  });

  it("arrayNotContains: returns true for non-array field", () => {
    expect(evaluate({ field: "name", operator: "arrayNotContains", value: "x" }, { name: "test" })).toBe(true);
  });

  it("arrayContains: empty array never contains", () => {
    expect(evaluate({ field: "tags", operator: "arrayContains", value: "x" }, { tags: [] })).toBe(false);
  });

  it("arrayNotContains: empty array always does not contain", () => {
    expect(evaluate({ field: "tags", operator: "arrayNotContains", value: "x" }, { tags: [] })).toBe(true);
  });

  // ---- lengthGreaterThan / lengthLessThan operators ----

  it("lengthGreaterThan: string length", () => {
    expect(evaluate({ field: "name", operator: "lengthGreaterThan", value: 3 }, { name: "John" })).toBe(true);
    expect(evaluate({ field: "name", operator: "lengthGreaterThan", value: 4 }, { name: "John" })).toBe(false);
    expect(evaluate({ field: "name", operator: "lengthGreaterThan", value: 5 }, { name: "John" })).toBe(false);
  });

  it("lengthGreaterThan: array length", () => {
    expect(evaluate({ field: "tags", operator: "lengthGreaterThan", value: 1 }, { tags: ["a", "b", "c"] })).toBe(true);
    expect(evaluate({ field: "tags", operator: "lengthGreaterThan", value: 3 }, { tags: ["a", "b", "c"] })).toBe(false);
  });

  it("lengthGreaterThan: non-string/array returns length 0", () => {
    expect(evaluate({ field: "num", operator: "lengthGreaterThan", value: 0 }, { num: 42 })).toBe(false);
    expect(evaluate({ field: "flag", operator: "lengthGreaterThan", value: 0 }, { flag: true })).toBe(false);
  });

  it("lengthLessThan: string length", () => {
    expect(evaluate({ field: "name", operator: "lengthLessThan", value: 5 }, { name: "John" })).toBe(true);
    expect(evaluate({ field: "name", operator: "lengthLessThan", value: 4 }, { name: "John" })).toBe(false);
  });

  it("lengthLessThan: array length", () => {
    expect(evaluate({ field: "tags", operator: "lengthLessThan", value: 5 }, { tags: ["a", "b"] })).toBe(true);
    expect(evaluate({ field: "tags", operator: "lengthLessThan", value: 2 }, { tags: ["a", "b"] })).toBe(false);
  });

  it("lengthLessThan: empty string has length 0", () => {
    expect(evaluate({ field: "s", operator: "lengthLessThan", value: 1 }, { s: "" })).toBe(true);
  });

  // ---- isEmpty / isNotEmpty operators ----

  it("isEmpty: empty values", () => {
    expect(evaluate({ field: "x", operator: "isEmpty" }, { x: "" })).toBe(true);
    expect(evaluate({ field: "x", operator: "isEmpty" }, { x: null })).toBe(true);
    expect(evaluate({ field: "x", operator: "isEmpty" }, {})).toBe(true);
  });

  it("isEmpty: non-empty values", () => {
    expect(evaluate({ field: "x", operator: "isEmpty" }, { x: "hello" })).toBe(false);
    expect(evaluate({ field: "x", operator: "isEmpty" }, { x: 0 })).toBe(false);
    expect(evaluate({ field: "x", operator: "isEmpty" }, { x: false })).toBe(false);
  });

  it("isNotEmpty: non-empty values", () => {
    expect(evaluate({ field: "x", operator: "isNotEmpty" }, { x: "hello" })).toBe(true);
    expect(evaluate({ field: "x", operator: "isNotEmpty" }, { x: 0 })).toBe(true);
    expect(evaluate({ field: "x", operator: "isNotEmpty" }, { x: false })).toBe(true);
  });

  it("isNotEmpty: empty values", () => {
    expect(evaluate({ field: "x", operator: "isNotEmpty" }, { x: "" })).toBe(false);
    expect(evaluate({ field: "x", operator: "isNotEmpty" }, { x: null })).toBe(false);
    expect(evaluate({ field: "x", operator: "isNotEmpty" }, {})).toBe(false);
  });

  // ---- Unknown operator ----

  it("unknown operator returns false", () => {
    expect(evaluate({ field: "x", operator: "bogus" as any, value: 1 }, { x: 1 })).toBe(false);
  });

  // ---- Edge: empty conditions array ----

  it("empty conditions array evaluates to true", () => {
    const expr: ConditionExpression = { combine: "AND", conditions: [] };
    expect(evaluate(expr, {})).toBe(true);
  });

  // ---- Edge: between with non-numeric field ----

  it("between: non-numeric field coerces to 0", () => {
    expect(evaluate({ field: "x", operator: "between", value: [-1, 1] }, { x: "abc" })).toBe(true);
    expect(evaluate({ field: "x", operator: "between", value: [1, 5] }, { x: "abc" })).toBe(false);
  });

  // ---- Edge: notIn with non-array condition ----

  it("notIn: returns true when conditionValue is not an array", () => {
    expect(evaluate({ field: "x", operator: "notIn", value: "not-array" }, { x: "a" })).toBe(true);
  });

  // ---- Edge: contains with non-string field ----

  it("contains: coerces non-string field to string", () => {
    expect(evaluate({ field: "num", operator: "contains", value: "4" }, { num: 42 })).toBe(true);
    expect(evaluate({ field: "num", operator: "contains", value: "5" }, { num: 42 })).toBe(false);
  });
});
