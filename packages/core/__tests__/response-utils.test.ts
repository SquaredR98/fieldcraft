import { describe, it, expect } from "vitest";
import { validateResponse, formatResponseValues, flattenResponse } from "../src/utils/response-utils";
import type { FormResponse } from "../src/types/response";
import type { FormEngineSchema, Question, Section } from "../src/types/schema";

// ---- Helpers ----

function makeField(overrides: Partial<Question> & { id: string; type: string; label: string }): Question {
  return { ...overrides } as Question;
}

function makeSection(overrides: Partial<Section> & { id: string; title: string; questions: Question[] }): Section {
  return { ...overrides } as Section;
}

function makeSchema(sections: Section[]): FormEngineSchema {
  return {
    id: "test-form",
    version: "1.0.0",
    title: "Test Form",
    sections,
    submitAction: { type: "callback" },
  } as FormEngineSchema;
}

function makeResponse(values: Record<string, unknown>, overrides?: Partial<FormResponse>): FormResponse {
  return {
    schemaId: "test-form",
    schemaVersion: "1.0.0",
    submittedAt: new Date().toISOString(),
    sessionToken: "test-token",
    values,
    ...overrides,
  };
}

// ---- validateResponse ----

describe("validateResponse", () => {
  const schema = makeSchema([
    makeSection({
      id: "s1",
      title: "Section 1",
      questions: [
        makeField({ id: "name", type: "short_text", label: "Name", required: true }),
        makeField({ id: "email", type: "email", label: "Email", required: true }),
        makeField({ id: "phone", type: "phone", label: "Phone" }),
      ],
    }),
  ]);

  it("returns valid for complete response", () => {
    const response = makeResponse({ name: "John", email: "john@test.com", phone: "123" });
    const result = validateResponse(response, schema);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("reports missing required fields", () => {
    const response = makeResponse({});
    const result = validateResponse(response, schema);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
    expect(result.errors[0]).toContain("name");
    expect(result.errors[1]).toContain("email");
  });

  it("reports empty string as missing for required fields", () => {
    const response = makeResponse({ name: "", email: "john@test.com" });
    const result = validateResponse(response, schema);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("name"))).toBe(true);
  });

  it("reports null as missing for required fields", () => {
    const response = makeResponse({ name: null, email: "john@test.com" });
    const result = validateResponse(response, schema);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("name"))).toBe(true);
  });

  it("allows optional fields to be missing", () => {
    const response = makeResponse({ name: "John", email: "john@test.com" });
    const result = validateResponse(response, schema);
    expect(result.valid).toBe(true);
  });

  it("reports unknown field IDs in response", () => {
    const response = makeResponse({ name: "John", email: "j@t.com", mystery: "value" });
    const result = validateResponse(response, schema);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("mystery"))).toBe(true);
  });

  it("reports both missing required and unknown fields", () => {
    const response = makeResponse({ unknown_field: "x" });
    const result = validateResponse(response, schema);
    expect(result.valid).toBe(false);
    // Should have errors for missing name, missing email, and unknown field
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });

  it("validates against empty schema (no required fields)", () => {
    const emptySchema = makeSchema([
      makeSection({ id: "s1", title: "S1", questions: [] }),
    ]);
    const response = makeResponse({});
    const result = validateResponse(response, emptySchema);
    expect(result.valid).toBe(true);
  });

  it("validates response with values across multiple sections", () => {
    const multiSchema = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [makeField({ id: "a", type: "short_text", label: "A", required: true })],
      }),
      makeSection({
        id: "s2",
        title: "S2",
        questions: [makeField({ id: "b", type: "short_text", label: "B", required: true })],
      }),
    ]);
    const response = makeResponse({ a: "val1", b: "val2" });
    const result = validateResponse(response, multiSchema);
    expect(result.valid).toBe(true);
  });

  it("handles 0 and false as valid values for required fields", () => {
    const numSchema = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [
          makeField({ id: "count", type: "number", label: "Count", required: true }),
          makeField({ id: "agree", type: "boolean", label: "Agree", required: true }),
        ],
      }),
    ]);
    const response = makeResponse({ count: 0, agree: false });
    const result = validateResponse(response, numSchema);
    expect(result.valid).toBe(true);
  });
});

// ---- formatResponseValues ----

describe("formatResponseValues", () => {
  const schema = makeSchema([
    makeSection({
      id: "s1",
      title: "Section 1",
      questions: [
        makeField({ id: "first_name", type: "short_text", label: "First Name" }),
        makeField({ id: "email_addr", type: "email", label: "Email Address" }),
      ],
    }),
  ]);

  it("maps field IDs to labels", () => {
    const response = makeResponse({ first_name: "John", email_addr: "john@test.com" });
    const result = formatResponseValues(response, schema);
    expect(result).toEqual({
      "First Name": "John",
      "Email Address": "john@test.com",
    });
  });

  it("uses field ID as fallback when not in schema", () => {
    const response = makeResponse({ first_name: "John", unknown: "value" });
    const result = formatResponseValues(response, schema);
    expect(result["First Name"]).toBe("John");
    expect(result["unknown"]).toBe("value");
  });

  it("handles empty response", () => {
    const response = makeResponse({});
    const result = formatResponseValues(response, schema);
    expect(result).toEqual({});
  });

  it("preserves non-string values", () => {
    const numSchema = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [makeField({ id: "age", type: "number", label: "Age" })],
      }),
    ]);
    const response = makeResponse({ age: 25 });
    const result = formatResponseValues(response, numSchema);
    expect(result["Age"]).toBe(25);
  });

  it("handles array values", () => {
    const msSchema = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [makeField({ id: "tags", type: "multi_select", label: "Tags" })],
      }),
    ]);
    const response = makeResponse({ tags: ["a", "b", "c"] });
    const result = formatResponseValues(response, msSchema);
    expect(result["Tags"]).toEqual(["a", "b", "c"]);
  });
});

// ---- flattenResponse ----

describe("flattenResponse", () => {
  const schema = makeSchema([
    makeSection({
      id: "s1",
      title: "Section 1",
      questions: [
        makeField({ id: "name", type: "short_text", label: "Full Name" }),
        makeField({ id: "email", type: "email", label: "Email" }),
      ],
    }),
    makeSection({
      id: "s2",
      title: "Section 2",
      questions: [
        makeField({ id: "age", type: "number", label: "Age" }),
      ],
    }),
  ]);

  it("returns headers as field labels in schema order", () => {
    const response = makeResponse({ name: "John", email: "j@t.com", age: 30 });
    const result = flattenResponse(response, schema);
    expect(result.headers).toEqual(["Full Name", "Email", "Age"]);
  });

  it("returns values in matching order", () => {
    const response = makeResponse({ name: "John", email: "j@t.com", age: 30 });
    const result = flattenResponse(response, schema);
    expect(result.values).toEqual(["John", "j@t.com", 30]);
  });

  it("uses empty string for missing values", () => {
    const response = makeResponse({ name: "John" });
    const result = flattenResponse(response, schema);
    expect(result.values).toEqual(["John", "", ""]);
  });

  it("includes all schema fields even if response has none", () => {
    const response = makeResponse({});
    const result = flattenResponse(response, schema);
    expect(result.headers).toEqual(["Full Name", "Email", "Age"]);
    expect(result.values).toEqual(["", "", ""]);
  });

  it("does not include extra response fields not in schema", () => {
    const response = makeResponse({ name: "John", email: "j@t.com", age: 30, extra: "ignored" });
    const result = flattenResponse(response, schema);
    expect(result.headers).toHaveLength(3);
    expect(result.values).toHaveLength(3);
  });

  it("preserves value types", () => {
    const response = makeResponse({ name: "John", email: "j@t.com", age: 30 });
    const result = flattenResponse(response, schema);
    expect(typeof result.values[0]).toBe("string");
    expect(typeof result.values[2]).toBe("number");
  });

  it("headers and values arrays have same length", () => {
    const response = makeResponse({ name: "John" });
    const result = flattenResponse(response, schema);
    expect(result.headers.length).toBe(result.values.length);
  });
});
