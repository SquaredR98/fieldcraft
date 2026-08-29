import { describe, it, expect } from "vitest";
import { validateSchema } from "../src/schema/schema-validator";
import type { FormEngineSchema } from "../src/types/schema";
import type { ConditionOperator } from "../src/types/conditions";

describe("Schema Validator — Condition Operators", () => {
  const ALL_OPERATORS: ConditionOperator[] = [
    "eq",
    "neq",
    "gt",
    "gte",
    "lt",
    "lte",
    "in",
    "notIn",
    "exists",
    "notExists",
    "isEmpty",
    "isNotEmpty",
    "contains",
    "notContains",
    "startsWith",
    "endsWith",
    "between",
    "matches",
    "matchesRegex",
    "dateAfter",
    "dateBefore",
    "arrayContains",
    "arrayNotContains",
    "lengthGreaterThan",
    "lengthLessThan",
  ];

  it("has exactly 25 operators in the test matrix", () => {
    expect(ALL_OPERATORS).toHaveLength(25);
  });

  ALL_OPERATORS.forEach((op) => {
    it(`validates schema successfully with condition operator "${op}"`, () => {
      const schema: FormEngineSchema = {
        id: `test-op-${op}`,
        version: "1.0.0",
        title: "Operator Test",
        sections: [
          {
            id: "s1",
            title: "Section 1",
            questions: [
              { id: "target_field", type: "short_text", label: "Target" },
              {
                id: "dependent_field",
                type: "short_text",
                label: "Dependent",
                showIf: {
                  field: "target_field",
                  operator: op,
                  value: op === "between" ? [1, 10] : op === "in" || op === "notIn" ? ["val"] : "val",
                },
              },
            ],
          },
        ],
        submitAction: { type: "callback" },
      };

      expect(() => validateSchema(schema)).not.toThrow();
    });
  });
});
