import { describe, it, expect } from "vitest";
import { evaluate } from "../src/engine/condition-evaluator";
import type { ConditionExpression } from "../src/types/conditions";

describe("Exhaustive Condition Evaluator & Operator Matrix", () => {
  describe("All 25 Operators Deterministic Input/Output", () => {
    it("eq: strict equality across various data types", () => {
      expect(evaluate({ field: "str", operator: "eq", value: "hello" }, { str: "hello" })).toBe(true);
      expect(evaluate({ field: "str", operator: "eq", value: "hello" }, { str: "world" })).toBe(false);
      expect(evaluate({ field: "num", operator: "eq", value: 42 }, { num: 42 })).toBe(true);
      expect(evaluate({ field: "num", operator: "eq", value: 42 }, { num: "42" })).toBe(false); // strict equality
      expect(evaluate({ field: "bool", operator: "eq", value: true }, { bool: true })).toBe(true);
      expect(evaluate({ field: "bool", operator: "eq", value: false }, { bool: false })).toBe(true);
      expect(evaluate({ field: "nullVal", operator: "eq", value: null }, { nullVal: null })).toBe(true);
    });

    it("neq: inequality check across data types", () => {
      expect(evaluate({ field: "val", operator: "neq", value: "a" }, { val: "b" })).toBe(true);
      expect(evaluate({ field: "val", operator: "neq", value: "a" }, { val: "a" })).toBe(false);
      expect(evaluate({ field: "val", operator: "neq", value: 10 }, { val: 20 })).toBe(true);
      expect(evaluate({ field: "val", operator: "neq", value: 10 }, { val: "10" })).toBe(true);
    });

    it("gt: greater than with numbers, strings, and non-numeric values", () => {
      expect(evaluate({ field: "num", operator: "gt", value: 10 }, { num: 15 })).toBe(true);
      expect(evaluate({ field: "num", operator: "gt", value: 10 }, { num: 10 })).toBe(false);
      expect(evaluate({ field: "num", operator: "gt", value: 10 }, { num: 5 })).toBe(false);
      // Coercion from numeric strings
      expect(evaluate({ field: "num", operator: "gt", value: "10" }, { num: "15" })).toBe(true);
      expect(evaluate({ field: "num", operator: "gt", value: 0 }, { num: "invalid" })).toBe(false); // NaN -> 0
    });

    it("gte: greater than or equal to", () => {
      expect(evaluate({ field: "score", operator: "gte", value: 80 }, { score: 80 })).toBe(true);
      expect(evaluate({ field: "score", operator: "gte", value: 80 }, { score: 85 })).toBe(true);
      expect(evaluate({ field: "score", operator: "gte", value: 80 }, { score: 79 })).toBe(false);
    });

    it("lt: less than with boundary checks", () => {
      expect(evaluate({ field: "age", operator: "lt", value: 18 }, { age: 17 })).toBe(true);
      expect(evaluate({ field: "age", operator: "lt", value: 18 }, { age: 18 })).toBe(false);
      expect(evaluate({ field: "age", operator: "lt", value: 18 }, { age: 19 })).toBe(false);
    });

    it("lte: less than or equal to", () => {
      expect(evaluate({ field: "rating", operator: "lte", value: 3 }, { rating: 3 })).toBe(true);
      expect(evaluate({ field: "rating", operator: "lte", value: 3 }, { rating: 2 })).toBe(true);
      expect(evaluate({ field: "rating", operator: "lte", value: 3 }, { rating: 4 })).toBe(false);
    });

    it("in: value membership in array", () => {
      expect(evaluate({ field: "country", operator: "in", value: ["US", "CA", "UK"] }, { country: "CA" })).toBe(true);
      expect(evaluate({ field: "country", operator: "in", value: ["US", "CA", "UK"] }, { country: "FR" })).toBe(false);
      expect(evaluate({ field: "country", operator: "in", value: "not-an-array" }, { country: "US" })).toBe(false);
      expect(evaluate({ field: "country", operator: "in", value: [] }, { country: "US" })).toBe(false);
    });

    it("notIn: value non-membership in array", () => {
      expect(evaluate({ field: "status", operator: "notIn", value: ["banned", "deleted"] }, { status: "active" })).toBe(true);
      expect(evaluate({ field: "status", operator: "notIn", value: ["banned", "deleted"] }, { status: "banned" })).toBe(false);
      expect(evaluate({ field: "status", operator: "notIn", value: "not-an-array" }, { status: "active" })).toBe(true);
    });

    it("exists / isNotEmpty: checks non-empty and non-nullish presence", () => {
      expect(evaluate({ field: "val", operator: "exists" }, { val: "text" })).toBe(true);
      expect(evaluate({ field: "val", operator: "exists" }, { val: 0 })).toBe(true);
      expect(evaluate({ field: "val", operator: "exists" }, { val: false })).toBe(true);
      expect(evaluate({ field: "val", operator: "exists" }, { val: "" })).toBe(false);
      expect(evaluate({ field: "val", operator: "exists" }, { val: null })).toBe(false);
      expect(evaluate({ field: "val", operator: "exists" }, {})).toBe(false);

      expect(evaluate({ field: "val", operator: "isNotEmpty" }, { val: "text" })).toBe(true);
      expect(evaluate({ field: "val", operator: "isNotEmpty" }, { val: "" })).toBe(false);
    });

    it("notExists / isEmpty: checks missing or empty presence", () => {
      expect(evaluate({ field: "val", operator: "notExists" }, {})).toBe(true);
      expect(evaluate({ field: "val", operator: "notExists" }, { val: "" })).toBe(true);
      expect(evaluate({ field: "val", operator: "notExists" }, { val: null })).toBe(true);
      expect(evaluate({ field: "val", operator: "notExists" }, { val: "filled" })).toBe(false);

      expect(evaluate({ field: "val", operator: "isEmpty" }, { val: "" })).toBe(true);
      expect(evaluate({ field: "val", operator: "isEmpty" }, { val: null })).toBe(true);
      expect(evaluate({ field: "val", operator: "isEmpty" }, { val: "filled" })).toBe(false);
    });

    it("contains: string substring containment", () => {
      expect(evaluate({ field: "email", operator: "contains", value: "@company.com" }, { email: "alice@company.com" })).toBe(true);
      expect(evaluate({ field: "email", operator: "contains", value: "@company.com" }, { email: "alice@gmail.com" })).toBe(false);
      expect(evaluate({ field: "count", operator: "contains", value: "2" }, { count: 120 })).toBe(true);
    });

    it("notContains: string substring non-containment", () => {
      expect(evaluate({ field: "bio", operator: "notContains", value: "spam" }, { bio: "Hello world" })).toBe(true);
      expect(evaluate({ field: "bio", operator: "notContains", value: "spam" }, { bio: "This is spammy" })).toBe(false);
    });

    it("startsWith: string prefix checking", () => {
      expect(evaluate({ field: "phone", operator: "startsWith", value: "+1" }, { phone: "+1 555-1234" })).toBe(true);
      expect(evaluate({ field: "phone", operator: "startsWith", value: "+1" }, { phone: "+44 20-7946" })).toBe(false);
    });

    it("endsWith: string suffix checking", () => {
      expect(evaluate({ field: "domain", operator: "endsWith", value: ".org" }, { domain: "wikipedia.org" })).toBe(true);
      expect(evaluate({ field: "domain", operator: "endsWith", value: ".org" }, { domain: "google.com" })).toBe(false);
    });

    it("between: numeric range boundary checking [min, max]", () => {
      expect(evaluate({ field: "age", operator: "between", value: [18, 65] }, { age: 18 })).toBe(true);
      expect(evaluate({ field: "age", operator: "between", value: [18, 65] }, { age: 65 })).toBe(true);
      expect(evaluate({ field: "age", operator: "between", value: [18, 65] }, { age: 30 })).toBe(true);
      expect(evaluate({ field: "age", operator: "between", value: [18, 65] }, { age: 17 })).toBe(false);
      expect(evaluate({ field: "age", operator: "between", value: [18, 65] }, { age: 66 })).toBe(false);
      // Malformed value
      expect(evaluate({ field: "age", operator: "between", value: [18] }, { age: 30 })).toBe(false);
      expect(evaluate({ field: "age", operator: "between", value: "not-array" }, { age: 30 })).toBe(false);
    });

    it("matches / matchesRegex: regular expression testing", () => {
      expect(evaluate({ field: "code", operator: "matches", value: "^[A-Z]{3}-\\d{3}$" }, { code: "ABC-123" })).toBe(true);
      expect(evaluate({ field: "code", operator: "matches", value: "^[A-Z]{3}-\\d{3}$" }, { code: "abc-123" })).toBe(false);
      expect(evaluate({ field: "code", operator: "matchesRegex", value: "^[A-Z]{3}-\\d{3}$" }, { code: "XYZ-999" })).toBe(true);
      expect(evaluate({ field: "code", operator: "matches", value: "[invalid regex(" }, { code: "anything" })).toBe(false);
    });

    it("dateAfter: date comparison", () => {
      expect(evaluate({ field: "dueDate", operator: "dateAfter", value: "2026-01-01" }, { dueDate: "2026-06-01" })).toBe(true);
      expect(evaluate({ field: "dueDate", operator: "dateAfter", value: "2026-01-01" }, { dueDate: "2025-12-31" })).toBe(false);
      expect(evaluate({ field: "dueDate", operator: "dateAfter", value: "2026-01-01" }, { dueDate: "2026-01-01" })).toBe(false); // strictly after
      expect(evaluate({ field: "dueDate", operator: "dateAfter", value: "2026-01-01" }, { dueDate: "invalid-date" })).toBe(false);
    });

    it("dateBefore: date comparison", () => {
      expect(evaluate({ field: "birthDate", operator: "dateBefore", value: "2010-01-01" }, { birthDate: "2000-05-15" })).toBe(true);
      expect(evaluate({ field: "birthDate", operator: "dateBefore", value: "2010-01-01" }, { birthDate: "2015-08-20" })).toBe(false);
      expect(evaluate({ field: "birthDate", operator: "dateBefore", value: "2010-01-01" }, { birthDate: "2010-01-01" })).toBe(false);
    });

    it("arrayContains: array contains item", () => {
      expect(evaluate({ field: "tags", operator: "arrayContains", value: "urgent" }, { tags: ["support", "urgent", "bug"] })).toBe(true);
      expect(evaluate({ field: "tags", operator: "arrayContains", value: "billing" }, { tags: ["support", "urgent", "bug"] })).toBe(false);
      expect(evaluate({ field: "tags", operator: "arrayContains", value: "urgent" }, { tags: "not-array" })).toBe(false);
    });

    it("arrayNotContains: array does not contain item", () => {
      expect(evaluate({ field: "roles", operator: "arrayNotContains", value: "admin" }, { roles: ["viewer", "editor"] })).toBe(true);
      expect(evaluate({ field: "roles", operator: "arrayNotContains", value: "admin" }, { roles: ["admin", "editor"] })).toBe(false);
      expect(evaluate({ field: "roles", operator: "arrayNotContains", value: "admin" }, { roles: null })).toBe(true);
    });

    it("lengthGreaterThan: string or array length comparison", () => {
      expect(evaluate({ field: "comment", operator: "lengthGreaterThan", value: 10 }, { comment: "12345678901" })).toBe(true);
      expect(evaluate({ field: "comment", operator: "lengthGreaterThan", value: 10 }, { comment: "12345" })).toBe(false);
      expect(evaluate({ field: "items", operator: "lengthGreaterThan", value: 2 }, { items: [1, 2, 3] })).toBe(true);
      expect(evaluate({ field: "items", operator: "lengthGreaterThan", value: 2 }, { items: [1] })).toBe(false);
      expect(evaluate({ field: "nonVal", operator: "lengthGreaterThan", value: 0 }, { nonVal: 12345 })).toBe(false); // numbers have len 0
    });

    it("lengthLessThan: string or array length comparison", () => {
      expect(evaluate({ field: "shortBio", operator: "lengthLessThan", value: 20 }, { shortBio: "Short text" })).toBe(true);
      expect(evaluate({ field: "shortBio", operator: "lengthLessThan", value: 5 }, { shortBio: "Too long text" })).toBe(false);
      expect(evaluate({ field: "list", operator: "lengthLessThan", value: 3 }, { list: ["a", "b"] })).toBe(true);
    });
  });

  describe("Complex Nested Condition Groups & Boolean Trees", () => {
    it("evaluates deep nested AND/OR expressions: (A AND B) OR (C AND (D OR E))", () => {
      const condition: ConditionExpression = {
        combine: "OR",
        conditions: [
          {
            combine: "AND",
            conditions: [
              { field: "isEmployed", operator: "eq", value: true },
              { field: "salary", operator: "gte", value: 50000 },
            ],
          },
          {
            combine: "AND",
            conditions: [
              { field: "hasGuarantor", operator: "eq", value: true },
              {
                combine: "OR",
                conditions: [
                  { field: "creditScore", operator: "gte", value: 700 },
                  { field: "collateralAmount", operator: "gte", value: 100000 },
                ],
              },
            ],
          },
        ],
      };

      // Branch 1 passes: isEmployed=true, salary=60000
      expect(evaluate(condition, { isEmployed: true, salary: 60000, hasGuarantor: false })).toBe(true);

      // Branch 1 fails, Branch 2 with creditScore passes
      expect(evaluate(condition, { isEmployed: false, salary: 0, hasGuarantor: true, creditScore: 720 })).toBe(true);

      // Branch 1 fails, Branch 2 with collateralAmount passes
      expect(evaluate(condition, { isEmployed: false, salary: 0, hasGuarantor: true, creditScore: 500, collateralAmount: 150000 })).toBe(true);

      // Both branches fail
      expect(evaluate(condition, { isEmployed: false, salary: 0, hasGuarantor: true, creditScore: 600, collateralAmount: 50000 })).toBe(false);
    });

    it("safely handles malformed and empty conditions", () => {
      // Empty condition object defaults to true (show field)
      expect(evaluate({} as ConditionExpression, {})).toBe(true);
      // Empty conditions array in group defaults to true
      expect(evaluate({ combine: "AND", conditions: [] }, {})).toBe(true);
      expect(evaluate({ combine: "OR", conditions: [] }, {})).toBe(true);
    });
  });
});
