import { describe, it, expect } from "vitest";
import { validateSchema, FormEngineSchemaError } from "../src/schema/schema-validator";
import type { FormEngineSchema } from "../src/types/schema";

// ---- Helper: minimal valid schema ----

function minimalSchema(overrides?: Partial<FormEngineSchema>): unknown {
  return {
    id: "test-form",
    version: "1.0.0",
    title: "Test Form",
    sections: [
      {
        id: "section-1",
        title: "Section 1",
        questions: [
          {
            id: "q1",
            type: "short_text",
            label: "Your Name",
          },
        ],
      },
    ],
    submitAction: { type: "callback" },
    ...overrides,
  };
}

// ---- Basic validation ----

describe("validateSchema", () => {
  it("accepts a minimal valid schema", () => {
    const schema = minimalSchema();
    const result = validateSchema(schema);
    expect(result.id).toBe("test-form");
    expect(result.sections).toHaveLength(1);
  });

  it("accepts a full schema with all optional fields", () => {
    const schema = minimalSchema({
      description: "A test form",
      branding: {
        logoUrl: "https://example.com/logo.png",
        logoAlt: "Logo",
        poweredBy: true,
      },
      settings: {
        displayMode: "stepped",
        allowDraftSave: true,
        draftStorage: "local",
        draftTtlHours: 48,
        showProgress: true,
        progressStyle: "bar",
        noPiiInLogs: false,
        locale: "en",
        submitButton: {
          label: "Send",
          loadingLabel: "Sending...",
          successLabel: "Sent!",
        },
        navigation: {
          showBack: true,
          showSectionList: false,
          nextLabel: "Continue",
          backLabel: "Go Back",
          allowSkip: false,
        },
      },
      onComplete: {
        type: "message",
        message: "Thank you!",
        showSummary: true,
      },
    });
    const result = validateSchema(schema);
    expect(result.settings?.displayMode).toBe("stepped");
    expect(result.onComplete?.type).toBe("message");
  });

  // ---- Missing required fields ----

  it("throws on missing id", () => {
    const schema = minimalSchema();
    delete (schema as Record<string, unknown>).id;
    expect(() => validateSchema(schema)).toThrow(FormEngineSchemaError);
  });

  it("throws on empty id", () => {
    expect(() => validateSchema(minimalSchema({ id: "" }))).toThrow(FormEngineSchemaError);
  });

  it("throws on missing version", () => {
    const schema = minimalSchema();
    delete (schema as Record<string, unknown>).version;
    expect(() => validateSchema(schema)).toThrow(FormEngineSchemaError);
  });

  it("throws on missing title", () => {
    const schema = minimalSchema();
    delete (schema as Record<string, unknown>).title;
    expect(() => validateSchema(schema)).toThrow(FormEngineSchemaError);
  });

  it("throws on missing sections", () => {
    const schema = minimalSchema();
    delete (schema as Record<string, unknown>).sections;
    expect(() => validateSchema(schema)).toThrow(FormEngineSchemaError);
  });

  it("throws on empty sections array", () => {
    expect(() => validateSchema(minimalSchema({ sections: [] }))).toThrow(FormEngineSchemaError);
  });

  it("throws on missing submitAction", () => {
    const schema = minimalSchema();
    delete (schema as Record<string, unknown>).submitAction;
    expect(() => validateSchema(schema)).toThrow(FormEngineSchemaError);
  });

  // ---- Section validation ----

  it("throws on section with no questions", () => {
    const schema = {
      ...minimalSchema(),
      sections: [{ id: "s1", title: "Empty", questions: [] }],
    };
    expect(() => validateSchema(schema)).toThrow(FormEngineSchemaError);
  });

  it("throws on section with missing id", () => {
    const schema = {
      ...minimalSchema(),
      sections: [{ title: "No ID", questions: [{ id: "q1", type: "short_text", label: "Q" }] }],
    };
    expect(() => validateSchema(schema)).toThrow(FormEngineSchemaError);
  });

  // ---- Duplicate IDs ----

  it("throws on duplicate section IDs", () => {
    const schema = minimalSchema({
      sections: [
        { id: "s1", title: "Section 1", questions: [{ id: "q1", type: "short_text", label: "Q1" }] },
        { id: "s1", title: "Section 2", questions: [{ id: "q2", type: "short_text", label: "Q2" }] },
      ],
    } as Partial<FormEngineSchema>);
    expect(() => validateSchema(schema)).toThrow("Duplicate section ID");
  });

  it("throws on duplicate question IDs across sections", () => {
    const schema = minimalSchema({
      sections: [
        { id: "s1", title: "Section 1", questions: [{ id: "q1", type: "short_text", label: "Q1" }] },
        { id: "s2", title: "Section 2", questions: [{ id: "q1", type: "email", label: "Q1 again" }] },
      ],
    } as Partial<FormEngineSchema>);
    expect(() => validateSchema(schema)).toThrow("Duplicate question ID");
  });

  // ---- Select type requires options ----

  it("throws when single_select has no options", () => {
    const schema = minimalSchema({
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [{ id: "q1", type: "single_select", label: "Choose" }],
        },
      ],
    } as Partial<FormEngineSchema>);
    expect(() => validateSchema(schema)).toThrow('requires options');
  });

  it("throws when multi_select has no options", () => {
    const schema = minimalSchema({
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [{ id: "q1", type: "multi_select", label: "Choose many" }],
        },
      ],
    } as Partial<FormEngineSchema>);
    expect(() => validateSchema(schema)).toThrow('requires options');
  });

  it("accepts single_select with options", () => {
    const schema = minimalSchema({
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [
            {
              id: "q1",
              type: "single_select",
              label: "Choose",
              options: [
                { label: "Option A", value: "a" },
                { label: "Option B", value: "b" },
              ],
            },
          ],
        },
      ],
    } as Partial<FormEngineSchema>);
    const result = validateSchema(schema);
    expect(result.sections[0].questions[0].options).toHaveLength(2);
  });

  // ---- Condition references ----

  it("throws when showIf references unknown field", () => {
    const schema = minimalSchema({
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [
            { id: "q1", type: "short_text", label: "Name" },
            {
              id: "q2",
              type: "short_text",
              label: "Conditional",
              showIf: { field: "nonexistent", operator: "eq", value: "test" },
            },
          ],
        },
      ],
    } as Partial<FormEngineSchema>);
    expect(() => validateSchema(schema)).toThrow('references unknown field "nonexistent"');
  });

  it("accepts showIf referencing an existing field", () => {
    const schema = minimalSchema({
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [
            { id: "q1", type: "boolean", label: "Has pet?" },
            {
              id: "q2",
              type: "short_text",
              label: "Pet name",
              showIf: { field: "q1", operator: "eq", value: true },
            },
          ],
        },
      ],
    } as Partial<FormEngineSchema>);
    const result = validateSchema(schema);
    expect(result.sections[0].questions).toHaveLength(2);
  });

  // ---- Jump logic references ----

  it("throws when jumpTo references unknown section", () => {
    const schema = minimalSchema({
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [{ id: "q1", type: "short_text", label: "Q1" }],
          onExit: {
            rules: [{ condition: { field: "q1", operator: "eq", value: "skip" }, jumpTo: "nonexistent" }],
          },
        },
        {
          id: "s2",
          title: "Section 2",
          questions: [{ id: "q2", type: "short_text", label: "Q2" }],
        },
      ],
    } as Partial<FormEngineSchema>);
    expect(() => validateSchema(schema)).toThrow('references unknown section "nonexistent"');
  });

  it("accepts valid jumpTo referencing existing section", () => {
    const schema = minimalSchema({
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [{ id: "q1", type: "short_text", label: "Q1" }],
          onExit: {
            rules: [{ condition: { field: "q1", operator: "eq", value: "skip" }, jumpTo: "s3" }],
            default: "s2",
          },
        },
        {
          id: "s2",
          title: "Section 2",
          questions: [{ id: "q2", type: "short_text", label: "Q2" }],
        },
        {
          id: "s3",
          title: "Section 3",
          questions: [{ id: "q3", type: "short_text", label: "Q3" }],
        },
      ],
    } as Partial<FormEngineSchema>);
    const result = validateSchema(schema);
    expect(result.sections).toHaveLength(3);
  });

  // ---- Config type mismatch ----

  it("throws when config.type does not match question type", () => {
    const schema = minimalSchema({
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [
            {
              id: "q1",
              type: "short_text",
              label: "Name",
              config: { type: "slider", min: 0, max: 100 },
            },
          ],
        },
      ],
    } as Partial<FormEngineSchema>);
    expect(() => validateSchema(schema)).toThrow("does not match question type");
  });

  it("accepts matching config.type", () => {
    const schema = minimalSchema({
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [
            {
              id: "q1",
              type: "slider",
              label: "Rate",
              config: { type: "slider", min: 0, max: 100, step: 5 },
            },
          ],
        },
      ],
    } as Partial<FormEngineSchema>);
    const result = validateSchema(schema);
    expect(result.sections[0].questions[0].config).toBeDefined();
  });

  // ---- Validation rules ----

  it("accepts questions with validation rules", () => {
    const schema = minimalSchema({
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [
            {
              id: "q1",
              type: "email",
              label: "Email",
              validation: [
                { type: "required", message: "Email is required" },
                { type: "email", message: "Must be a valid email" },
              ],
            },
            {
              id: "q2",
              type: "number",
              label: "Age",
              validation: [
                { type: "min", value: 0 },
                { type: "max", value: 150 },
              ],
            },
          ],
        },
      ],
    } as Partial<FormEngineSchema>);
    const result = validateSchema(schema);
    expect(result.sections[0].questions[0].validation).toHaveLength(2);
  });

  // ---- Nested conditions ----

  it("accepts nested AND/OR conditions", () => {
    const schema = minimalSchema({
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [
            { id: "age", type: "number", label: "Age" },
            { id: "consent", type: "boolean", label: "Consent?" },
            {
              id: "q3",
              type: "short_text",
              label: "Conditional",
              showIf: {
                combine: "AND",
                conditions: [
                  { field: "age", operator: "gte", value: 18 },
                  { field: "consent", operator: "eq", value: true },
                ],
              },
            },
          ],
        },
      ],
    } as Partial<FormEngineSchema>);
    const result = validateSchema(schema);
    expect(result.sections[0].questions[2].showIf).toBeDefined();
  });

  // ---- Error class ----

  it("FormEngineSchemaError has issues array", () => {
    try {
      validateSchema({});
    } catch (err) {
      expect(err).toBeInstanceOf(FormEngineSchemaError);
      expect((err as FormEngineSchemaError).issues.length).toBeGreaterThan(0);
      expect((err as FormEngineSchemaError).message).toContain("Invalid FormEngine schema");
    }
  });

  // ---- Non-object input ----

  it("throws on null input", () => {
    expect(() => validateSchema(null)).toThrow(FormEngineSchemaError);
  });

  it("throws on string input", () => {
    expect(() => validateSchema("not a schema")).toThrow(FormEngineSchemaError);
  });

  it("throws on number input", () => {
    expect(() => validateSchema(42)).toThrow(FormEngineSchemaError);
  });
});
