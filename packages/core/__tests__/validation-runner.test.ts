import { describe, it, expect } from "vitest";
import { validateField, validateSection, validateAll } from "../src/engine/validation-runner";
import { createValidatorRegistry } from "../src/validators/registry";
import type { Question, Section, FormEngineSchema } from "../src/types/schema";

// ---- Helpers ----

function makeField(overrides: Partial<Question> & { id: string; type: string; label: string }): Question {
  return { ...overrides } as Question;
}

function makeSection(overrides: Partial<Section> & { id: string; title: string; questions: Question[] }): Section {
  return { ...overrides } as Section;
}

// ---- validateField ----

describe("validateField", () => {
  it("returns empty array for valid field with no rules", () => {
    const field = makeField({ id: "q1", type: "short_text", label: "Name" });
    expect(validateField(field, "John", {})).toEqual([]);
  });

  // ---- required ----

  it("required: fails on empty string", () => {
    const field = makeField({ id: "q1", type: "short_text", label: "Name", required: true });
    const errors = validateField(field, "", {});
    expect(errors).toContain("This field is required");
  });

  it("required: fails on undefined", () => {
    const field = makeField({ id: "q1", type: "short_text", label: "Name", required: true });
    expect(validateField(field, undefined, {})).toHaveLength(1);
  });

  it("required: fails on null", () => {
    const field = makeField({ id: "q1", type: "short_text", label: "Name", required: true });
    expect(validateField(field, null, {})).toHaveLength(1);
  });

  it("required: passes on valid value", () => {
    const field = makeField({ id: "q1", type: "short_text", label: "Name", required: true });
    expect(validateField(field, "John", {})).toEqual([]);
  });

  it("required: conditional — required when condition is true", () => {
    const field = makeField({
      id: "q2",
      type: "short_text",
      label: "Phone",
      required: { field: "contact", operator: "eq", value: "phone" },
    });
    // Condition is true → required
    expect(validateField(field, "", { contact: "phone" })).toHaveLength(1);
    // Condition is false → not required
    expect(validateField(field, "", { contact: "email" })).toEqual([]);
  });

  // ---- min / max ----

  it("min: fails below minimum", () => {
    const field = makeField({
      id: "q1", type: "number", label: "Age",
      validation: [{ type: "min", value: 0 }],
    });
    expect(validateField(field, -1, {})).toHaveLength(1);
    expect(validateField(field, 0, {})).toEqual([]);
    expect(validateField(field, 5, {})).toEqual([]);
  });

  it("max: fails above maximum", () => {
    const field = makeField({
      id: "q1", type: "number", label: "Age",
      validation: [{ type: "max", value: 150 }],
    });
    expect(validateField(field, 200, {})).toHaveLength(1);
    expect(validateField(field, 150, {})).toEqual([]);
  });

  // ---- minLength / maxLength ----

  it("minLength: fails when too short", () => {
    const field = makeField({
      id: "q1", type: "short_text", label: "Name",
      validation: [{ type: "minLength", value: 3 }],
    });
    expect(validateField(field, "Jo", {})).toHaveLength(1);
    expect(validateField(field, "Joe", {})).toEqual([]);
  });

  it("maxLength: fails when too long", () => {
    const field = makeField({
      id: "q1", type: "short_text", label: "Code",
      validation: [{ type: "maxLength", value: 5 }],
    });
    expect(validateField(field, "ABCDEF", {})).toHaveLength(1);
    expect(validateField(field, "ABCDE", {})).toEqual([]);
  });

  // ---- pattern ----

  it("pattern: validates against regex", () => {
    const field = makeField({
      id: "q1", type: "short_text", label: "Code",
      validation: [{ type: "pattern", regex: "^[A-Z]{3}$" }],
    });
    expect(validateField(field, "ABC", {})).toEqual([]);
    expect(validateField(field, "abc", {})).toHaveLength(1);
    expect(validateField(field, "ABCD", {})).toHaveLength(1);
  });

  // ---- email ----

  it("email: validates email format", () => {
    const field = makeField({
      id: "q1", type: "email", label: "Email",
      validation: [{ type: "email" }],
    });
    expect(validateField(field, "user@example.com", {})).toEqual([]);
    expect(validateField(field, "not-an-email", {})).toHaveLength(1);
    expect(validateField(field, "user@", {})).toHaveLength(1);
  });

  // ---- phone ----

  it("phone: validates phone format", () => {
    const field = makeField({
      id: "q1", type: "phone", label: "Phone",
      validation: [{ type: "phone" }],
    });
    expect(validateField(field, "+1 (555) 123-4567", {})).toEqual([]);
    expect(validateField(field, "abc", {})).toHaveLength(1);
  });

  // ---- url ----

  it("url: validates URL format", () => {
    const field = makeField({
      id: "q1", type: "url", label: "Website",
      validation: [{ type: "url" }],
    });
    expect(validateField(field, "https://example.com", {})).toEqual([]);
    expect(validateField(field, "not a url", {})).toHaveLength(1);
  });

  // ---- date ----

  it("date: validates date range", () => {
    const field = makeField({
      id: "q1", type: "date", label: "Date",
      validation: [{ type: "date", min: "2024-01-01", max: "2024-12-31" }],
    });
    expect(validateField(field, "2024-06-15", {})).toEqual([]);
    expect(validateField(field, "2023-06-15", {})).toHaveLength(1);
    expect(validateField(field, "2025-01-01", {})).toHaveLength(1);
  });

  // ---- Skip validation on empty non-required fields ----

  it("skips validation rules when value is empty and not required", () => {
    const field = makeField({
      id: "q1", type: "email", label: "Email",
      validation: [{ type: "email" }],
    });
    expect(validateField(field, "", {})).toEqual([]);
    expect(validateField(field, undefined, {})).toEqual([]);
  });

  // ---- Multiple rules ----

  it("collects errors from multiple failing rules", () => {
    const field = makeField({
      id: "q1", type: "short_text", label: "Code",
      validation: [
        { type: "minLength", value: 5 },
        { type: "pattern", regex: "^[A-Z]+$" },
      ],
    });
    const errors = validateField(field, "ab", {});
    expect(errors).toHaveLength(2);
  });

  // ---- Custom validator ----

  it("runs custom validators from registry", () => {
    const registry = createValidatorRegistry({
      noSpam: (value) => {
        if (String(value).includes("spam")) return "No spam allowed";
        return null;
      },
    });
    const field = makeField({
      id: "q1", type: "short_text", label: "Input",
      validation: [{ type: "custom", name: "noSpam" }],
    });
    expect(validateField(field, "hello", {}, registry)).toEqual([]);
    expect(validateField(field, "buy spam now", {}, registry)).toHaveLength(1);
  });

  it("custom message overrides validator message", () => {
    const registry = createValidatorRegistry({
      noSpam: (value) => {
        if (String(value).includes("spam")) return "No spam allowed";
        return null;
      },
    });
    const field = makeField({
      id: "q1", type: "short_text", label: "Input",
      validation: [{ type: "custom", name: "noSpam", message: "Custom error" }],
    });
    const errors = validateField(field, "buy spam now", {}, registry);
    expect(errors[0]).toBe("Custom error");
  });
});

// ---- validateSection ----

describe("validateSection", () => {
  it("validates all visible fields in a section", () => {
    const section = makeSection({
      id: "s1",
      title: "Section 1",
      questions: [
        makeField({ id: "name", type: "short_text", label: "Name", required: true }),
        makeField({ id: "email", type: "email", label: "Email", validation: [{ type: "email" }] }),
      ],
    });

    const result = validateSection(section, {});
    expect(result.valid).toBe(false);
    expect(result.errors["name"]).toBeDefined();
    expect(result.firstErrorFieldId).toBe("name");
  });

  it("skips hidden fields (showIf false)", () => {
    const section = makeSection({
      id: "s1",
      title: "Section 1",
      questions: [
        makeField({ id: "has_pet", type: "boolean", label: "Has pet?" }),
        makeField({
          id: "pet_name",
          type: "short_text",
          label: "Pet name",
          required: true,
          showIf: { field: "has_pet", operator: "eq", value: true },
        }),
      ],
    });

    // has_pet is false → pet_name is hidden → skip validation
    const result = validateSection(section, { has_pet: false });
    expect(result.valid).toBe(true);
  });

  it("validates hidden fields when they become visible", () => {
    const section = makeSection({
      id: "s1",
      title: "Section 1",
      questions: [
        makeField({ id: "has_pet", type: "boolean", label: "Has pet?" }),
        makeField({
          id: "pet_name",
          type: "short_text",
          label: "Pet name",
          required: true,
          showIf: { field: "has_pet", operator: "eq", value: true },
        }),
      ],
    });

    // has_pet is true → pet_name is visible → validate it
    const result = validateSection(section, { has_pet: true });
    expect(result.valid).toBe(false);
    expect(result.errors["pet_name"]).toBeDefined();
  });

  it("skips structural fields (section_header, info_block)", () => {
    const section = makeSection({
      id: "s1",
      title: "Section 1",
      questions: [
        makeField({ id: "header", type: "section_header", label: "Header" }),
        makeField({ id: "info", type: "info_block", label: "Info" }),
        makeField({ id: "q1", type: "short_text", label: "Name", required: true }),
      ],
    });

    const result = validateSection(section, { q1: "John" });
    expect(result.valid).toBe(true);
  });

  it("returns valid for section with all fields filled", () => {
    const section = makeSection({
      id: "s1",
      title: "Section 1",
      questions: [
        makeField({ id: "name", type: "short_text", label: "Name", required: true }),
        makeField({ id: "age", type: "number", label: "Age", validation: [{ type: "min", value: 0 }] }),
      ],
    });

    const result = validateSection(section, { name: "John", age: 25 });
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});

// ---- validateAll ----

describe("validateAll", () => {
  it("validates across all visible sections", () => {
    const schema: FormEngineSchema = {
      id: "test",
      version: "1.0.0",
      title: "Test",
      sections: [
        makeSection({
          id: "s1",
          title: "Section 1",
          questions: [makeField({ id: "q1", type: "short_text", label: "Q1", required: true })],
        }),
        makeSection({
          id: "s2",
          title: "Section 2",
          questions: [makeField({ id: "q2", type: "email", label: "Q2", required: true })],
        }),
      ],
      submitAction: { type: "callback" },
    };

    const result = validateAll(schema, {});
    expect(result.valid).toBe(false);
    expect(result.errors["q1"]).toBeDefined();
    expect(result.errors["q2"]).toBeDefined();
    expect(result.firstErrorFieldId).toBe("q1");
    expect(result.firstErrorSectionId).toBe("s1");
  });

  it("skips hidden sections", () => {
    const schema: FormEngineSchema = {
      id: "test",
      version: "1.0.0",
      title: "Test",
      sections: [
        makeSection({
          id: "s1",
          title: "Section 1",
          questions: [makeField({ id: "q1", type: "short_text", label: "Q1" })],
        }),
        makeSection({
          id: "s2",
          title: "Hidden Section",
          showIf: { field: "q1", operator: "eq", value: "show" },
          questions: [makeField({ id: "q2", type: "short_text", label: "Q2", required: true })],
        }),
      ],
      submitAction: { type: "callback" },
    };

    // q1 != "show" → s2 is hidden → q2 not validated
    const result = validateAll(schema, { q1: "other" });
    expect(result.valid).toBe(true);
  });

  it("validates all sections when all visible", () => {
    const schema: FormEngineSchema = {
      id: "test",
      version: "1.0.0",
      title: "Test",
      sections: [
        makeSection({
          id: "s1",
          title: "Section 1",
          questions: [makeField({ id: "q1", type: "short_text", label: "Q1", required: true })],
        }),
      ],
      submitAction: { type: "callback" },
    };

    const result = validateAll(schema, { q1: "filled" });
    expect(result.valid).toBe(true);
  });
});
