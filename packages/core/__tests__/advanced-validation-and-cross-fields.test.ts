import { describe, it, expect } from "vitest";
import { validateField, validateFieldAsync, validateAll } from "../src/engine/validation-runner";
import { createValidatorRegistry } from "../src/validators/registry";
import type { FormEngineSchema, Question } from "../src/types/schema";

describe("Advanced Validation & Cross-Field Rules", () => {
  const registry = createValidatorRegistry(
    {
      customEvenNumber: (val) => {
        if (Number(val) % 2 !== 0) return "Must be an even number";
        return null;
      },
      throwingValidator: () => {
        throw new Error("Fatal validator crash");
      },
    },
    {
      checkUsernameAvailable: async (val) => {
        if (val === "taken_user") return "Username is already taken";
        return null;
      },
    },
  );

  describe("compareToField cross-field validation", () => {
    const passwordField: Question = {
      id: "confirmPassword",
      type: "short_text",
      label: "Confirm Password",
      validation: [
        { type: "compareToField", fieldId: "password", operator: "eq", message: "Passwords must match" },
      ],
    };

    it("passes when field values match exactly", () => {
      const errors = validateField(passwordField, "Secret123", { password: "Secret123" }, registry);
      expect(errors).toEqual([]);
    });

    it("fails when field values differ", () => {
      const errors = validateField(passwordField, "Secret123", { password: "DifferentPassword" }, registry);
      expect(errors).toEqual(["Passwords must match"]);
    });

    it("validates numeric comparisons (salaryMax >= salaryMin)", () => {
      const salaryMaxField: Question = {
        id: "salaryMax",
        type: "number",
        label: "Max Salary",
        validation: [
          { type: "compareToField", fieldId: "salaryMin", operator: "gte", message: "Max salary must be >= min salary" },
        ],
      };

      expect(validateField(salaryMaxField, 100000, { salaryMin: 80000 }, registry)).toEqual([]);
      expect(validateField(salaryMaxField, 80000, { salaryMin: 80000 }, registry)).toEqual([]);
      expect(validateField(salaryMaxField, 60000, { salaryMin: 80000 }, registry)).toEqual(["Max salary must be >= min salary"]);
    });

    it("validates date comparisons (endDate > startDate)", () => {
      const endDateField: Question = {
        id: "endDate",
        type: "date",
        label: "End Date",
        validation: [
          { type: "compareToField", fieldId: "startDate", operator: "gt", message: "End date must be after start date" },
        ],
      };

      expect(validateField(endDateField, "2026-12-31", { startDate: "2026-01-01" }, registry)).toEqual([]);
      expect(validateField(endDateField, "2025-12-31", { startDate: "2026-01-01" }, registry)).toEqual(["End date must be after start date"]);
    });
  });

  describe("Matrix config-driven validation", () => {
    const matrixFieldAll: Question = {
      id: "feedbackMatrix",
      type: "matrix",
      label: "Feedback",
      config: {
        type: "matrix",
        required: "all",
        rows: [
          { label: "Speed", value: "speed" },
          { label: "Quality", value: "quality" },
          { label: "Support", value: "support" },
        ],
        columns: [
          { label: "Poor", value: "1" },
          { label: "Good", value: "2" },
        ],
      },
    };

    it("matrix required='all' enforces all rows to be answered", () => {
      // 1 row missing
      const partialVal = { speed: "2", quality: "1" };
      const errors = validateField(matrixFieldAll, partialVal, { feedbackMatrix: partialVal }, registry);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain("All rows must be answered (1 remaining)");

      // All rows answered
      const fullVal = { speed: "2", quality: "1", support: "2" };
      expect(validateField(matrixFieldAll, fullVal, { feedbackMatrix: fullVal }, registry)).toEqual([]);
    });

    it("matrix required='any' enforces at least one row to be answered", () => {
      const matrixFieldAny: Question = {
        ...matrixFieldAll,
        config: {
          type: "matrix",
          required: "any",
          rows: [
            { label: "Speed", value: "speed" },
            { label: "Quality", value: "quality" },
            { label: "Support", value: "support" },
          ],
          columns: [
            { label: "Poor", value: "1" },
            { label: "Good", value: "2" },
          ],
        },
      };

      expect(validateField(matrixFieldAny, {}, {}, registry)).toEqual(["At least one row must be answered"]);
      expect(validateField(matrixFieldAny, { speed: "2" }, {}, registry)).toEqual([]);
    });
  });

  describe("MultiSelect minSelections validation", () => {
    const multiSelectField: Question = {
      id: "skills",
      type: "multi_select",
      label: "Skills",
      config: {
        type: "multi_select",
        minSelections: 2,
      },
      options: [
        { label: "React", value: "react" },
        { label: "Node", value: "node" },
        { label: "TypeScript", value: "ts" },
      ],
    };

    it("fails when selected items count is less than minSelections", () => {
      expect(validateField(multiSelectField, ["react"], {}, registry)).toEqual(["Select at least 2 options"]);
      expect(validateField(multiSelectField, ["react", "ts"], {}, registry)).toEqual([]);
    });
  });

  describe("Custom & Async validator resilience", () => {
    it("safely catches and wraps errors thrown by custom validators", () => {
      const fieldWithCrashingValidator: Question = {
        id: "crashField",
        type: "short_text",
        label: "Crash Field",
        validation: [{ type: "custom", name: "throwingValidator" }],
      };

      const errors = validateField(fieldWithCrashingValidator, "someValue", {}, registry);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain("Custom validator 'throwingValidator' threw: Fatal validator crash");
    });

    it("executes async validators via validateFieldAsync", async () => {
      const usernameField: Question = {
        id: "username",
        type: "short_text",
        label: "Username",
        validation: [{ type: "async", endpoint: "checkUsernameAvailable" }],
      };

      const errorsTaken = await validateFieldAsync(usernameField, "taken_user", registry);
      expect(errorsTaken).toEqual(["Username is already taken"]);

      const errorsAvailable = await validateFieldAsync(usernameField, "new_user", registry);
      expect(errorsAvailable).toEqual([]);
    });
  });

  describe("Exclusion of structural / non-input fields from validation passes", () => {
    it("skips non-input fields (info_block, divider, welcome-screen) during full form validation", () => {
      const schema: FormEngineSchema = {
        id: "structural-test",
        version: "1.0.0",
        title: "Structural Test",
        sections: [
          {
            id: "s1",
            title: "Section 1",
            questions: [
              { id: "w1", type: "welcome-screen", label: "Welcome" },
              { id: "d1", type: "divider", label: "Divider" },
              { id: "h1", type: "section_header", label: "Header" },
              { id: "name", type: "short_text", label: "Name", required: true },
            ],
          },
        ],
        submitAction: { type: "callback" },
      };

      // When name is empty, only name has an error
      const resultInvalid = validateAll(schema, {}, registry);
      expect(resultInvalid.valid).toBe(false);
      expect(Object.keys(resultInvalid.errors)).toEqual(["name"]);

      // When name is provided, entire form is valid
      const resultValid = validateAll(schema, { name: "Alice" }, registry);
      expect(resultValid.valid).toBe(true);
      expect(resultValid.errors).toEqual({});
    });
  });
});
