import { describe, it, expect } from "vitest";
import { exportFormData } from "../src/utils/export";
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
    submittedAt: "2024-01-15T10:30:00.000Z",
    sessionToken: "test-token-123",
    values,
    ...overrides,
  };
}

const schema = makeSchema([
  makeSection({
    id: "s1",
    title: "Section 1",
    questions: [
      makeField({ id: "name", type: "short_text", label: "Full Name" }),
      makeField({ id: "email", type: "email", label: "Email" }),
      makeField({ id: "age", type: "number", label: "Age" }),
    ],
  }),
]);

// ---- JSON export ----

describe("exportFormData — json", () => {
  it("returns pretty-printed JSON string", () => {
    const response = makeResponse({ name: "John", email: "john@test.com", age: 30 });
    const result = exportFormData(response, schema, "json");
    expect(typeof result).toBe("string");
    const parsed = JSON.parse(result);
    expect(parsed.values.name).toBe("John");
    expect(parsed.values.email).toBe("john@test.com");
    expect(parsed.values.age).toBe(30);
  });

  it("includes schemaId and schemaVersion", () => {
    const response = makeResponse({ name: "John" });
    const parsed = JSON.parse(exportFormData(response, schema, "json"));
    expect(parsed.schemaId).toBe("test-form");
    expect(parsed.schemaVersion).toBe("1.0.0");
  });

  it("includes submittedAt timestamp", () => {
    const response = makeResponse({ name: "John" });
    const parsed = JSON.parse(exportFormData(response, schema, "json"));
    expect(parsed.submittedAt).toBe("2024-01-15T10:30:00.000Z");
  });

  it("includes scores and totalScore when present", () => {
    const response = makeResponse({ name: "John" }, {
      scores: { q1: 5, q2: 8 },
      totalScore: 13,
    });
    const parsed = JSON.parse(exportFormData(response, schema, "json"));
    expect(parsed.scores).toEqual({ q1: 5, q2: 8 });
    expect(parsed.totalScore).toBe(13);
  });

  it("includes metadata when present", () => {
    const response = makeResponse({ name: "John" }, {
      metadata: { userAgent: "test-browser", referrer: "https://example.com" },
    });
    const parsed = JSON.parse(exportFormData(response, schema, "json"));
    expect(parsed.metadata.userAgent).toBe("test-browser");
  });

  it("handles empty values", () => {
    const response = makeResponse({});
    const parsed = JSON.parse(exportFormData(response, schema, "json"));
    expect(parsed.values).toEqual({});
  });

  it("is valid JSON (can be parsed back)", () => {
    const response = makeResponse({ name: "John \"Doe\"", email: "j@t.com" });
    const result = exportFormData(response, schema, "json");
    expect(() => JSON.parse(result)).not.toThrow();
  });
});

// ---- CSV export ----

describe("exportFormData — csv", () => {
  it("returns CSV with headers and values", () => {
    const response = makeResponse({ name: "John", email: "john@test.com", age: 30 });
    const result = exportFormData(response, schema, "csv");
    const [headers, values] = result.split("\n");
    expect(headers).toBe("Full Name,Email,Age");
    expect(values).toBe("John,john@test.com,30");
  });

  it("uses field labels as headers", () => {
    const response = makeResponse({ name: "John" });
    const result = exportFormData(response, schema, "csv");
    const headers = result.split("\n")[0];
    expect(headers).toContain("Full Name");
  });

  it("uses field ID as header fallback for unknown fields", () => {
    // When values contain a key not in the schema, use the key itself
    const response = makeResponse({ name: "John", custom_field: "data" });
    const result = exportFormData(response, schema, "csv");
    expect(result).toContain("custom_field");
  });

  it("escapes values containing commas", () => {
    const response = makeResponse({ name: "Doe, John", email: "j@t.com", age: 30 });
    const result = exportFormData(response, schema, "csv");
    expect(result).toContain('"Doe, John"');
  });

  it("escapes values containing double quotes", () => {
    const response = makeResponse({ name: 'John "JD" Doe', email: "j@t.com", age: 30 });
    const result = exportFormData(response, schema, "csv");
    expect(result).toContain('"John ""JD"" Doe"');
  });

  it("escapes values containing newlines", () => {
    const response = makeResponse({ name: "John\nDoe", email: "j@t.com", age: 30 });
    const result = exportFormData(response, schema, "csv");
    expect(result).toContain('"John\nDoe"');
  });

  it("handles null and undefined values as empty strings", () => {
    const response = makeResponse({ name: null, email: undefined, age: 30 });
    const result = exportFormData(response, schema, "csv");
    const values = result.split("\n")[1];
    // null and undefined should produce empty cells
    expect(values).toMatch(/^,.*,30$|^,,30$/);
  });

  it("joins array values with semicolons", () => {
    const msSchema = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [makeField({ id: "tags", type: "multi_select", label: "Tags" })],
      }),
    ]);
    const response = makeResponse({ tags: ["web", "mobile", "api"] });
    const result = exportFormData(response, msSchema, "csv");
    expect(result).toContain("web; mobile; api");
  });

  it("handles empty response values", () => {
    const response = makeResponse({});
    const result = exportFormData(response, schema, "csv");
    // Should still have header row and (empty) value row
    expect(result.split("\n")).toHaveLength(2);
  });
});

// ---- Flat export ----

describe("exportFormData — flat", () => {
  it("returns flat key-value object", () => {
    const response = makeResponse({ name: "John", email: "j@t.com", age: 30 });
    const result = exportFormData(response, schema, "flat");
    expect(typeof result).toBe("object");
    expect(result).toEqual({ name: "John", email: "j@t.com", age: 30 });
  });

  it("flattens nested objects with dot notation", () => {
    const response = makeResponse({
      name: "John",
      address: { city: "NYC", state: "NY" },
    });
    const result = exportFormData(response, schema, "flat");
    expect(result["address.city"]).toBe("NYC");
    expect(result["address.state"]).toBe("NY");
    expect(result["name"]).toBe("John");
  });

  it("preserves arrays as leaf values", () => {
    const response = makeResponse({ tags: ["a", "b", "c"] });
    const result = exportFormData(response, schema, "flat");
    expect(result["tags"]).toEqual(["a", "b", "c"]);
  });

  it("handles empty response", () => {
    const response = makeResponse({});
    const result = exportFormData(response, schema, "flat");
    expect(result).toEqual({});
  });

  it("handles deeply nested values", () => {
    const response = makeResponse({
      billing: { address: { street: "123 Main", city: "NYC" } },
    });
    const result = exportFormData(response, schema, "flat");
    expect(result["billing.address.street"]).toBe("123 Main");
    expect(result["billing.address.city"]).toBe("NYC");
  });
});

// ---- Invalid format ----

describe("exportFormData — invalid format", () => {
  it("throws for unsupported format", () => {
    const response = makeResponse({ name: "John" });
    expect(() => exportFormData(response, schema, "xml" as any)).toThrow("Unsupported export format");
  });
});
