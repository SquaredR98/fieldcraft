import type { FormResponse } from "../types/response";
import type { FormEngineSchema } from "../types/schema";

/**
 * Validates that a response matches a schema — checks that all required field IDs
 * have non-empty values and that all field IDs in the response exist in the schema.
 *
 * @param response - The form response to validate.
 * @param schema - The schema the response was generated from.
 * @returns An object with `valid` boolean and array of `errors`.
 * @since 1.4.0
 */
export function validateResponse(
  response: FormResponse,
  schema: FormEngineSchema,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const schemaFieldIds = new Set<string>();

  for (const section of schema.sections) {
    for (const q of section.questions) {
      schemaFieldIds.add(q.id);
      if (q.required === true) {
        const val = response.values[q.id];
        if (val === undefined || val === null || val === "") {
          errors.push(`Required field "${q.id}" is missing or empty`);
        }
      }
    }
  }

  // Check for unknown field IDs in response
  for (const fieldId of Object.keys(response.values)) {
    if (!schemaFieldIds.has(fieldId)) {
      errors.push(`Response contains unknown field "${fieldId}" not in schema`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Formats response values into a human-readable object using field labels.
 *
 * @param response - The form response.
 * @param schema - The schema with field labels.
 * @returns Object keyed by field label with formatted values.
 * @since 1.4.0
 */
export function formatResponseValues(
  response: FormResponse,
  schema: FormEngineSchema,
): Record<string, unknown> {
  const labelMap = new Map<string, string>();
  for (const section of schema.sections) {
    for (const q of section.questions) {
      labelMap.set(q.id, q.label);
    }
  }

  const result: Record<string, unknown> = {};
  for (const [fieldId, value] of Object.entries(response.values)) {
    const label = labelMap.get(fieldId) ?? fieldId;
    result[label] = value;
  }
  return result;
}

/**
 * Flattens a response into a single-row array suitable for CSV export.
 * Returns headers (field labels) and values in corresponding order.
 *
 * @param response - The form response.
 * @param schema - The schema with field labels.
 * @returns Object with `headers` and `values` arrays.
 * @since 1.4.0
 */
export function flattenResponse(
  response: FormResponse,
  schema: FormEngineSchema,
): { headers: string[]; values: unknown[] } {
  const headers: string[] = [];
  const values: unknown[] = [];

  for (const section of schema.sections) {
    for (const q of section.questions) {
      headers.push(q.label);
      values.push(response.values[q.id] ?? "");
    }
  }

  return { headers, values };
}
