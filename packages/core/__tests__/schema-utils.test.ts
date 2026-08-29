import { describe, it, expect } from "vitest";
import {
  getFieldById,
  getAllFieldIds,
  getRequiredFieldIds,
  cloneSchema,
  mergeSchemas,
  createEmptySchema,
  schemaDiff,
  migrateSchema,
} from "../src/utils/schema-utils";
import type { FormEngineSchema, Question, Section } from "../src/types/schema";

// ---- Helpers ----

function makeField(overrides: Partial<Question> & { id: string; type: string; label: string }): Question {
  return { ...overrides } as Question;
}

function makeSection(overrides: Partial<Section> & { id: string; title: string; questions: Question[] }): Section {
  return { ...overrides } as Section;
}

function makeSchema(sections: Section[], overrides?: Partial<FormEngineSchema>): FormEngineSchema {
  return {
    id: "test-form",
    version: "1.0.0",
    title: "Test Form",
    sections,
    submitAction: { type: "callback" },
    ...overrides,
  } as FormEngineSchema;
}

// ---- getFieldById ----

describe("getFieldById", () => {
  const schema = makeSchema([
    makeSection({
      id: "s1",
      title: "Section 1",
      questions: [
        makeField({ id: "name", type: "short_text", label: "Name" }),
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

  it("finds a field in the first section", () => {
    const field = getFieldById(schema, "name");
    expect(field).toBeDefined();
    expect(field!.id).toBe("name");
    expect(field!.label).toBe("Name");
  });

  it("finds a field in a later section", () => {
    const field = getFieldById(schema, "age");
    expect(field).toBeDefined();
    expect(field!.id).toBe("age");
  });

  it("returns undefined for non-existent field ID", () => {
    expect(getFieldById(schema, "nonexistent")).toBeUndefined();
  });

  it("returns undefined for empty string ID", () => {
    expect(getFieldById(schema, "")).toBeUndefined();
  });

  it("returns the first match if duplicate IDs exist", () => {
    const dupeSchema = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [makeField({ id: "dup", type: "short_text", label: "First" })],
      }),
      makeSection({
        id: "s2",
        title: "S2",
        questions: [makeField({ id: "dup", type: "number", label: "Second" })],
      }),
    ]);
    const field = getFieldById(dupeSchema, "dup");
    expect(field!.label).toBe("First");
  });

  it("works with schema that has no sections", () => {
    const empty = makeSchema([]);
    expect(getFieldById(empty, "anything")).toBeUndefined();
  });

  it("works with section that has no questions", () => {
    const emptySection = makeSchema([
      makeSection({ id: "s1", title: "Empty", questions: [] }),
    ]);
    expect(getFieldById(emptySection, "anything")).toBeUndefined();
  });
});

// ---- getAllFieldIds ----

describe("getAllFieldIds", () => {
  it("returns all field IDs across sections", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [
          makeField({ id: "a", type: "short_text", label: "A" }),
          makeField({ id: "b", type: "short_text", label: "B" }),
        ],
      }),
      makeSection({
        id: "s2",
        title: "S2",
        questions: [
          makeField({ id: "c", type: "number", label: "C" }),
        ],
      }),
    ]);
    expect(getAllFieldIds(schema)).toEqual(["a", "b", "c"]);
  });

  it("returns empty array for schema with no sections", () => {
    expect(getAllFieldIds(makeSchema([]))).toEqual([]);
  });

  it("returns empty array for sections with no questions", () => {
    const schema = makeSchema([
      makeSection({ id: "s1", title: "S1", questions: [] }),
    ]);
    expect(getAllFieldIds(schema)).toEqual([]);
  });

  it("includes structural field IDs", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [
          makeField({ id: "divider1", type: "divider", label: "Divider" }),
          makeField({ id: "name", type: "short_text", label: "Name" }),
        ],
      }),
    ]);
    // getAllFieldIds does not filter — it returns all question IDs
    expect(getAllFieldIds(schema)).toEqual(["divider1", "name"]);
  });

  it("preserves insertion order", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [
          makeField({ id: "z", type: "short_text", label: "Z" }),
          makeField({ id: "a", type: "short_text", label: "A" }),
          makeField({ id: "m", type: "short_text", label: "M" }),
        ],
      }),
    ]);
    expect(getAllFieldIds(schema)).toEqual(["z", "a", "m"]);
  });
});

// ---- getRequiredFieldIds ----

describe("getRequiredFieldIds", () => {
  it("returns IDs of fields with required=true", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [
          makeField({ id: "name", type: "short_text", label: "Name", required: true }),
          makeField({ id: "email", type: "email", label: "Email" }),
          makeField({ id: "phone", type: "phone", label: "Phone", required: true }),
        ],
      }),
    ]);
    expect(getRequiredFieldIds(schema)).toEqual(["name", "phone"]);
  });

  it("does not include conditionally required fields", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [
          makeField({
            id: "company",
            type: "short_text",
            label: "Company",
            required: { field: "role", operator: "eq", value: "employee" },
          }),
        ],
      }),
    ]);
    // Only includes boolean true, not conditional expressions
    expect(getRequiredFieldIds(schema)).toEqual([]);
  });

  it("returns empty array when no fields are required", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [
          makeField({ id: "a", type: "short_text", label: "A" }),
          makeField({ id: "b", type: "short_text", label: "B", required: false }),
        ],
      }),
    ]);
    expect(getRequiredFieldIds(schema)).toEqual([]);
  });

  it("returns empty for empty schema", () => {
    expect(getRequiredFieldIds(makeSchema([]))).toEqual([]);
  });

  it("works across multiple sections", () => {
    const schema = makeSchema([
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
    expect(getRequiredFieldIds(schema)).toEqual(["a", "b"]);
  });
});

// ---- cloneSchema ----

describe("cloneSchema", () => {
  it("produces a deep clone with no shared references", () => {
    const original = makeSchema([
      makeSection({
        id: "s1",
        title: "Section 1",
        questions: [
          makeField({ id: "name", type: "short_text", label: "Name", required: true }),
        ],
      }),
    ]);

    const clone = cloneSchema(original);

    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);
    expect(clone.sections).not.toBe(original.sections);
    expect(clone.sections[0]).not.toBe(original.sections[0]);
    expect(clone.sections[0].questions[0]).not.toBe(original.sections[0].questions[0]);
  });

  it("mutations to clone do not affect original", () => {
    const original = makeSchema([
      makeSection({
        id: "s1",
        title: "Section 1",
        questions: [makeField({ id: "q1", type: "short_text", label: "Q1" })],
      }),
    ]);

    const clone = cloneSchema(original);
    clone.title = "Modified";
    clone.sections[0].title = "Modified Section";
    (clone.sections[0].questions[0] as any).label = "Modified Label";

    expect(original.title).toBe("Test Form");
    expect(original.sections[0].title).toBe("Section 1");
    expect(original.sections[0].questions[0].label).toBe("Q1");
  });

  it("handles schema with nested config objects", () => {
    const original = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [
          makeField({
            id: "rating",
            type: "rating",
            label: "Rating",
            config: { type: "rating", max: 5, icon: "star" },
          }),
        ],
      }),
    ]);

    const clone = cloneSchema(original);
    expect(clone.sections[0].questions[0].config).toEqual(original.sections[0].questions[0].config);
    expect(clone.sections[0].questions[0].config).not.toBe(original.sections[0].questions[0].config);
  });
});

// ---- mergeSchemas ----

describe("mergeSchemas", () => {
  it("appends sections from b to a", () => {
    const a = makeSchema([
      makeSection({ id: "s1", title: "S1", questions: [] }),
    ]);
    const b: Partial<FormEngineSchema> = {
      sections: [makeSection({ id: "s2", title: "S2", questions: [] })],
    };

    const merged = mergeSchemas(a, b);
    expect(merged.sections).toHaveLength(2);
    expect(merged.sections[0].id).toBe("s1");
    expect(merged.sections[1].id).toBe("s2");
  });

  it("overrides top-level properties from b", () => {
    const a = makeSchema([], { title: "Form A", version: "1.0.0" });
    const b: Partial<FormEngineSchema> = { title: "Form B", version: "2.0.0" };

    const merged = mergeSchemas(a, b);
    expect(merged.title).toBe("Form B");
    expect(merged.version).toBe("2.0.0");
  });

  it("preserves a's sections when b has no sections", () => {
    const a = makeSchema([
      makeSection({ id: "s1", title: "S1", questions: [] }),
    ]);
    const b: Partial<FormEngineSchema> = { title: "New Title" };

    const merged = mergeSchemas(a, b);
    expect(merged.sections).toHaveLength(1);
    expect(merged.sections[0].id).toBe("s1");
    expect(merged.title).toBe("New Title");
  });

  it("does not mutate original schemas", () => {
    const a = makeSchema([
      makeSection({ id: "s1", title: "S1", questions: [] }),
    ]);
    const b: Partial<FormEngineSchema> = {
      sections: [makeSection({ id: "s2", title: "S2", questions: [] })],
    };

    mergeSchemas(a, b);
    expect(a.sections).toHaveLength(1);
  });

  it("handles both schemas with empty sections", () => {
    const a = makeSchema([]);
    const b: Partial<FormEngineSchema> = { sections: [] };

    const merged = mergeSchemas(a, b);
    expect(merged.sections).toEqual([]);
  });

  it("preserves a's ID and submitAction when not overridden", () => {
    const a = makeSchema([], { id: "form-a", submitAction: { type: "callback" } });
    const b: Partial<FormEngineSchema> = { title: "Updated" };

    const merged = mergeSchemas(a, b);
    expect(merged.id).toBe("form-a");
    expect(merged.submitAction).toEqual({ type: "callback" });
  });
});

// ---- createEmptySchema ----

describe("createEmptySchema", () => {
  it("creates a schema with the given title", () => {
    const schema = createEmptySchema("My Form");
    expect(schema.title).toBe("My Form");
  });

  it("uses 'Untitled Form' when no title is provided", () => {
    const schema = createEmptySchema();
    expect(schema.title).toBe("Untitled Form");
  });

  it("has one empty section", () => {
    const schema = createEmptySchema();
    expect(schema.sections).toHaveLength(1);
    expect(schema.sections[0].id).toBe("section-1");
    expect(schema.sections[0].title).toBe("Section 1");
    expect(schema.sections[0].questions).toEqual([]);
  });

  it("has a valid version", () => {
    const schema = createEmptySchema();
    expect(schema.version).toBe("1.0.0");
  });

  it("has an auto-generated id starting with 'form-'", () => {
    const schema = createEmptySchema();
    expect(schema.id).toMatch(/^form-\d+$/);
  });

  it("generates IDs based on Date.now()", () => {
    const before = Date.now();
    const schema = createEmptySchema();
    const after = Date.now();
    const timestamp = Number(schema.id.replace("form-", ""));
    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });

  it("has callback submitAction", () => {
    const schema = createEmptySchema();
    expect(schema.submitAction).toEqual({ type: "callback" });
  });
});

// ---- schemaDiff ----

describe("schemaDiff", () => {
  it("detects added fields", () => {
    const a = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [makeField({ id: "name", type: "short_text", label: "Name" })],
      }),
    ]);
    const b = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [
          makeField({ id: "name", type: "short_text", label: "Name" }),
          makeField({ id: "email", type: "email", label: "Email" }),
        ],
      }),
    ]);

    const diff = schemaDiff(a, b);
    expect(diff.added).toEqual(["email"]);
    expect(diff.removed).toEqual([]);
    expect(diff.typeChanged).toEqual([]);
  });

  it("detects removed fields", () => {
    const a = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [
          makeField({ id: "name", type: "short_text", label: "Name" }),
          makeField({ id: "email", type: "email", label: "Email" }),
        ],
      }),
    ]);
    const b = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [makeField({ id: "name", type: "short_text", label: "Name" })],
      }),
    ]);

    const diff = schemaDiff(a, b);
    expect(diff.added).toEqual([]);
    expect(diff.removed).toEqual(["email"]);
    expect(diff.typeChanged).toEqual([]);
  });

  it("detects type changes", () => {
    const a = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [makeField({ id: "age", type: "short_text", label: "Age" })],
      }),
    ]);
    const b = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [makeField({ id: "age", type: "number", label: "Age" })],
      }),
    ]);

    const diff = schemaDiff(a, b);
    expect(diff.added).toEqual([]);
    expect(diff.removed).toEqual([]);
    expect(diff.typeChanged).toEqual(["age"]);
  });

  it("handles both schemas being identical", () => {
    const schema = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [makeField({ id: "q1", type: "short_text", label: "Q1" })],
      }),
    ]);

    const diff = schemaDiff(schema, schema);
    expect(diff.added).toEqual([]);
    expect(diff.removed).toEqual([]);
    expect(diff.typeChanged).toEqual([]);
  });

  it("handles both schemas being empty", () => {
    const diff = schemaDiff(makeSchema([]), makeSchema([]));
    expect(diff.added).toEqual([]);
    expect(diff.removed).toEqual([]);
    expect(diff.typeChanged).toEqual([]);
  });

  it("handles fields moving between sections", () => {
    const a = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [makeField({ id: "name", type: "short_text", label: "Name" })],
      }),
    ]);
    const b = makeSchema([
      makeSection({ id: "s1", title: "S1", questions: [] }),
      makeSection({
        id: "s2",
        title: "S2",
        questions: [makeField({ id: "name", type: "short_text", label: "Name" })],
      }),
    ]);

    // Same field ID, same type — should show no changes
    const diff = schemaDiff(a, b);
    expect(diff.added).toEqual([]);
    expect(diff.removed).toEqual([]);
    expect(diff.typeChanged).toEqual([]);
  });

  it("detects multiple changes at once", () => {
    const a = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [
          makeField({ id: "keep", type: "short_text", label: "Keep" }),
          makeField({ id: "removed", type: "email", label: "Removed" }),
          makeField({ id: "changed", type: "short_text", label: "Changed" }),
        ],
      }),
    ]);
    const b = makeSchema([
      makeSection({
        id: "s1",
        title: "S1",
        questions: [
          makeField({ id: "keep", type: "short_text", label: "Keep" }),
          makeField({ id: "added", type: "number", label: "Added" }),
          makeField({ id: "changed", type: "long_text", label: "Changed" }),
        ],
      }),
    ]);

    const diff = schemaDiff(a, b);
    expect(diff.added).toEqual(["added"]);
    expect(diff.removed).toEqual(["removed"]);
    expect(diff.typeChanged).toEqual(["changed"]);
  });
});

// ---- migrateSchema ----

describe("migrateSchema", () => {
  it("applies migrations in version order", () => {
    const schema = makeSchema([], { version: "1.0.0" });

    const migrations = {
      "2.0.0": (s: FormEngineSchema) => ({ ...s, title: "V2" }),
      "3.0.0": (s: FormEngineSchema) => ({ ...s, title: s.title + " → V3" }),
    };

    const result = migrateSchema(schema, migrations);
    expect(result.title).toBe("V2 → V3");
    expect(result.version).toBe("3.0.0");
  });

  it("skips migrations at or below current version", () => {
    const schema = makeSchema([], { version: "2.0.0" });

    const migrations = {
      "1.0.0": (s: FormEngineSchema) => ({ ...s, title: "Should not apply" }),
      "2.0.0": (s: FormEngineSchema) => ({ ...s, title: "Should not apply either" }),
      "3.0.0": (s: FormEngineSchema) => ({ ...s, title: "V3" }),
    };

    const result = migrateSchema(schema, migrations);
    expect(result.title).toBe("V3");
    expect(result.version).toBe("3.0.0");
  });

  it("returns unchanged schema when no migrations apply", () => {
    const schema = makeSchema([], { version: "5.0.0", title: "Latest" });

    const migrations = {
      "1.0.0": (s: FormEngineSchema) => ({ ...s, title: "Old" }),
      "3.0.0": (s: FormEngineSchema) => ({ ...s, title: "Older" }),
    };

    const result = migrateSchema(schema, migrations);
    expect(result.title).toBe("Latest");
    expect(result.version).toBe("5.0.0");
  });

  it("does not mutate the original schema", () => {
    const schema = makeSchema([], { version: "1.0.0", title: "Original" });

    const migrations = {
      "2.0.0": (s: FormEngineSchema) => ({ ...s, title: "Migrated" }),
    };

    const result = migrateSchema(schema, migrations);
    expect(result.title).toBe("Migrated");
    expect(schema.title).toBe("Original");
    expect(schema.version).toBe("1.0.0");
  });

  it("handles empty migrations map", () => {
    const schema = makeSchema([], { version: "1.0.0", title: "Same" });
    const result = migrateSchema(schema, {});
    expect(result.title).toBe("Same");
    expect(result.version).toBe("1.0.0");
  });

  it("migration can add sections", () => {
    const schema = makeSchema([], { version: "1.0.0" });

    const migrations = {
      "2.0.0": (s: FormEngineSchema) => ({
        ...s,
        sections: [
          ...s.sections,
          makeSection({
            id: "new-section",
            title: "New",
            questions: [makeField({ id: "new-field", type: "short_text", label: "New" })],
          }),
        ],
      }),
    };

    const result = migrateSchema(schema, migrations);
    expect(result.sections).toHaveLength(1);
    expect(result.sections[0].id).toBe("new-section");
  });
});
