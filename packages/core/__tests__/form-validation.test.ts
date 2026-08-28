import { describe, it, expect } from "vitest";
import { validateFormValues } from "../src/utils/form-validation";
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
    title: "Test Form",
    sections,
  } as FormEngineSchema;
}

// ---- validateFormValues ----

describe("validateFormValues", () => {
  it("returns valid for a form with all values satisfied", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "Section 1",
        questions: [
          makeField({ id: "name", type: "short_text", label: "Name", required: true }),
          makeField({ id: "email", type: "email", label: "Email" }),
        ],
      }),
    ]);

    const result = validateFormValues(schema, { name: "John", email: "john@example.com" });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("returns errors for missing required fields", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "Section 1",
        questions: [
          makeField({ id: "name", type: "short_text", label: "Name", required: true }),
          makeField({ id: "age", type: "number", label: "Age", required: true }),
        ],
      }),
    ]);

    const result = validateFormValues(schema, {});
    expect(result.valid).toBe(false);
    expect(result.errors["name"]).toBeDefined();
    expect(result.errors["age"]).toBeDefined();
    expect(result.firstErrorFieldId).toBe("name");
    expect(result.firstErrorSectionId).toBe("s1");
  });

  it("runs built-in email validator via explicit validation rules", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "Section 1",
        questions: [
          makeField({
            id: "email",
            type: "email",
            label: "Email",
            validation: [{ type: "email" }],
          }),
        ],
      }),
    ]);

    const result = validateFormValues(schema, { email: "not-an-email" });
    expect(result.valid).toBe(false);
    expect(result.errors["email"]).toBeDefined();
  });

  it("runs built-in min/max validators via explicit rules", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "Section 1",
        questions: [
          makeField({
            id: "score",
            type: "number",
            label: "Score",
            validation: [
              { type: "min", value: 0 },
              { type: "max", value: 100 },
            ],
          }),
        ],
      }),
    ]);

    const tooLow = validateFormValues(schema, { score: -5 });
    expect(tooLow.valid).toBe(false);
    expect(tooLow.errors["score"]).toBeDefined();

    const tooHigh = validateFormValues(schema, { score: 200 });
    expect(tooHigh.valid).toBe(false);

    const valid = validateFormValues(schema, { score: 50 });
    expect(valid.valid).toBe(true);
  });

  it("validates multi_select config.minSelections", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "Section 1",
        questions: [
          makeField({
            id: "tags",
            type: "multi_select",
            label: "Tags",
            config: { type: "multi_select", minSelections: 2 },
            options: [
              { label: "A", value: "a" },
              { label: "B", value: "b" },
              { label: "C", value: "c" },
            ],
          }),
        ],
      }),
    ]);

    const tooFew = validateFormValues(schema, { tags: ["a"] });
    expect(tooFew.valid).toBe(false);
    expect(tooFew.errors["tags"]![0]).toContain("at least 2");

    const valid = validateFormValues(schema, { tags: ["a", "b"] });
    expect(valid.valid).toBe(true);
  });

  it("validates matrix config.required='all'", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "Section 1",
        questions: [
          makeField({
            id: "matrix",
            type: "matrix",
            label: "Rate each area",
            config: {
              type: "matrix",
              rows: [
                { label: "Communication", value: "comm" },
                { label: "Balance", value: "balance" },
              ],
              columns: [
                { label: "Good", value: "good" },
                { label: "Bad", value: "bad" },
              ],
              inputType: "radio",
              required: "all",
            },
          }),
        ],
      }),
    ]);

    const incomplete = validateFormValues(schema, { matrix: { comm: "good" } });
    expect(incomplete.valid).toBe(false);
    expect(incomplete.errors["matrix"]![0]).toContain("All rows");

    const complete = validateFormValues(schema, { matrix: { comm: "good", balance: "bad" } });
    expect(complete.valid).toBe(true);
  });

  it("skips non-input fields (divider, spacer, etc.)", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "Section 1",
        questions: [
          makeField({ id: "div1", type: "divider", label: "Divider" }),
          makeField({ id: "sp1", type: "spacer", label: "Spacer" }),
          makeField({ id: "info1", type: "info_block", label: "Info" }),
          makeField({ id: "sh1", type: "section_header", label: "Header" }),
          makeField({ id: "pb1", type: "page_break", label: "Break" }),
          makeField({ id: "ws1", type: "welcome-screen", label: "Welcome" }),
          makeField({ id: "ty1", type: "thank-you-screen", label: "Thanks" }),
          makeField({ id: "rt1", type: "rich-text", label: "Rich" }),
          makeField({ id: "img1", type: "image", label: "Image" }),
          makeField({ id: "vid1", type: "video", label: "Video" }),
        ],
      }),
    ]);

    // No values at all — should still be valid because none of these are input fields
    const result = validateFormValues(schema, {});
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("skips hidden fields (showIf evaluates to false)", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "Section 1",
        questions: [
          makeField({ id: "role", type: "single_select", label: "Role" }),
          makeField({
            id: "company",
            type: "short_text",
            label: "Company",
            required: true,
            showIf: { field: "role", operator: "eq", value: "employee" },
          }),
        ],
      }),
    ]);

    // role is not "employee" → company field is hidden → not validated
    const result = validateFormValues(schema, { role: "student" });
    expect(result.valid).toBe(true);

    // role is "employee" → company field is visible and required
    const result2 = validateFormValues(schema, { role: "employee" });
    expect(result2.valid).toBe(false);
    expect(result2.errors["company"]).toBeDefined();
  });

  it("skips hidden sections", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "Visible Section",
        questions: [
          makeField({ id: "name", type: "short_text", label: "Name", required: true }),
        ],
      }),
      makeSection({
        id: "s2",
        title: "Hidden Section",
        showIf: { field: "name", operator: "eq", value: "admin" },
        questions: [
          makeField({ id: "secret", type: "short_text", label: "Secret", required: true }),
        ],
      }),
    ]);

    // name is "John" → s2 is hidden → secret not validated
    const result = validateFormValues(schema, { name: "John" });
    expect(result.valid).toBe(true);

    // name is "admin" → s2 is visible → secret is required
    const result2 = validateFormValues(schema, { name: "admin" });
    expect(result2.valid).toBe(false);
    expect(result2.errors["secret"]).toBeDefined();
  });

  it("returns firstErrorFieldId and firstErrorSectionId", () => {
    const schema = makeSchema([
      makeSection({
        id: "personal",
        title: "Personal",
        questions: [
          makeField({ id: "name", type: "short_text", label: "Name" }),
        ],
      }),
      makeSection({
        id: "contact",
        title: "Contact",
        questions: [
          makeField({ id: "email", type: "email", label: "Email", required: true }),
          makeField({ id: "phone", type: "phone", label: "Phone", required: true }),
        ],
      }),
    ]);

    const result = validateFormValues(schema, { name: "John" });
    expect(result.valid).toBe(false);
    expect(result.firstErrorFieldId).toBe("email");
    expect(result.firstErrorSectionId).toBe("contact");
  });

  it("validates across multiple sections", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "Section 1",
        questions: [
          makeField({ id: "f1", type: "short_text", label: "F1", required: true }),
        ],
      }),
      makeSection({
        id: "s2",
        title: "Section 2",
        questions: [
          makeField({ id: "f2", type: "short_text", label: "F2", required: true }),
        ],
      }),
    ]);

    const result = validateFormValues(schema, {});
    expect(result.valid).toBe(false);
    expect(result.errors["f1"]).toBeDefined();
    expect(result.errors["f2"]).toBeDefined();
  });

  it("skips empty optional fields without running validators", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "Section 1",
        questions: [
          makeField({
            id: "website",
            type: "url",
            label: "Website",
            validation: [{ type: "url" }],
          }),
        ],
      }),
    ]);

    // Optional + empty → should pass (validators skip empty values)
    const result = validateFormValues(schema, {});
    expect(result.valid).toBe(true);
  });

  it("returns valid for empty schema", () => {
    const schema = makeSchema([]);
    const result = validateFormValues(schema, {});
    expect(result.valid).toBe(true);
  });
});
