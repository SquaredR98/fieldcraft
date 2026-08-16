import type { FormEngineSchema, Question } from "../types/schema";

/**
 * Finds a question by ID across all sections in a schema.
 *
 * @param schema - The form schema to search.
 * @param fieldId - The question ID to find.
 * @returns The Question object, or `undefined` if not found.
 * @since 1.4.0
 */
export function getFieldById(schema: FormEngineSchema, fieldId: string): Question | undefined {
  for (const section of schema.sections) {
    const q = section.questions.find((q) => q.id === fieldId);
    if (q) return q;
  }
  return undefined;
}

/**
 * Returns all field IDs in a schema, across all sections.
 *
 * @param schema - The form schema.
 * @returns Array of field ID strings.
 * @since 1.4.0
 */
export function getAllFieldIds(schema: FormEngineSchema): string[] {
  const ids: string[] = [];
  for (const section of schema.sections) {
    for (const q of section.questions) {
      ids.push(q.id);
    }
  }
  return ids;
}

/**
 * Returns the IDs of all required fields in a schema.
 * Only includes fields where `required` is `true` (not conditional expressions).
 *
 * @param schema - The form schema.
 * @returns Array of required field ID strings.
 * @since 1.4.0
 */
export function getRequiredFieldIds(schema: FormEngineSchema): string[] {
  const ids: string[] = [];
  for (const section of schema.sections) {
    for (const q of section.questions) {
      if (q.required === true) {
        ids.push(q.id);
      }
    }
  }
  return ids;
}

/**
 * Creates a deep clone of a schema.
 *
 * @param schema - The schema to clone.
 * @returns A new schema object with no shared references.
 * @since 1.4.0
 */
export function cloneSchema(schema: FormEngineSchema): FormEngineSchema {
  return JSON.parse(JSON.stringify(schema));
}

/**
 * Merges two schemas. The second schema's sections are appended to the first.
 * Top-level properties from `b` override those in `a`.
 *
 * @param a - Base schema.
 * @param b - Schema to merge in. Sections are appended, other properties override.
 * @returns A new merged schema.
 * @since 1.4.0
 */
export function mergeSchemas(a: FormEngineSchema, b: Partial<FormEngineSchema>): FormEngineSchema {
  return {
    ...a,
    ...b,
    sections: [...a.sections, ...(b.sections ?? [])],
  };
}

/**
 * Creates an empty schema with a title and minimal required structure.
 *
 * @param title - The form title. Defaults to `"Untitled Form"`.
 * @returns A valid FormEngineSchema with one empty section.
 * @since 1.4.0
 */
export function createEmptySchema(title?: string): FormEngineSchema {
  return {
    id: `form-${Date.now()}`,
    version: "1.0.0",
    title: title ?? "Untitled Form",
    sections: [
      {
        id: "section-1",
        title: "Section 1",
        questions: [],
      },
    ],
    submitAction: { type: "callback" },
  };
}

/**
 * Result of comparing two schemas.
 * @since 1.4.0
 */
export type SchemaDiff = {
  /** Field IDs present in `b` but not in `a`. */
  added: string[];
  /** Field IDs present in `a` but not in `b`. */
  removed: string[];
  /** Field IDs present in both but with different types. */
  typeChanged: string[];
};

/**
 * Compares two schemas and returns the differences in field structure.
 *
 * @param a - The "before" schema.
 * @param b - The "after" schema.
 * @returns A `SchemaDiff` object describing added, removed, and type-changed fields.
 * @since 1.4.0
 */
export function schemaDiff(a: FormEngineSchema, b: FormEngineSchema): SchemaDiff {
  const aFields = new Map<string, string>();
  const bFields = new Map<string, string>();

  for (const section of a.sections) {
    for (const q of section.questions) {
      aFields.set(q.id, q.type);
    }
  }
  for (const section of b.sections) {
    for (const q of section.questions) {
      bFields.set(q.id, q.type);
    }
  }

  const added: string[] = [];
  const removed: string[] = [];
  const typeChanged: string[] = [];

  for (const [id] of bFields) {
    if (!aFields.has(id)) added.push(id);
  }
  for (const [id] of aFields) {
    if (!bFields.has(id)) removed.push(id);
  }
  for (const [id, type] of aFields) {
    if (bFields.has(id) && bFields.get(id) !== type) {
      typeChanged.push(id);
    }
  }

  return { added, removed, typeChanged };
}

/**
 * Applies a series of migration functions to a schema.
 * Migrations are applied in the order of their version keys (sorted lexicographically).
 *
 * @param schema - The schema to migrate.
 * @param migrations - Map of version strings to migration functions.
 * @returns The migrated schema.
 * @since 1.4.0
 */
export function migrateSchema(
  schema: FormEngineSchema,
  migrations: Record<string, (s: FormEngineSchema) => FormEngineSchema>,
): FormEngineSchema {
  let result = cloneSchema(schema);
  const versions = Object.keys(migrations).sort();

  for (const version of versions) {
    if (result.version < version) {
      result = migrations[version](result);
      result.version = version;
    }
  }

  return result;
}
