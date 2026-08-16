import type { FormResponse } from "../types/response";
import type { FormEngineSchema } from "../types/schema";

/**
 * Supported export formats for `exportFormData`.
 *
 * - `"json"` — Pretty-printed JSON of the response values.
 * - `"csv"` — Single-row CSV with field IDs as headers.
 * - `"flat"` — Flat key-value object with dot notation for nested values.
 *
 * @since 1.4.0
 */
export type ExportFormat = "json" | "csv" | "flat";

/**
 * Exports form response data in the specified format.
 *
 * @param response - The form response to export.
 * @param schema - The schema used to resolve field labels for CSV headers.
 * @param format - Output format: `"json"`, `"csv"`, or `"flat"`.
 * @returns The exported data as a string (json/csv) or a flat object.
 *
 * @example
 * ```typescript
 * const csv = exportFormData(response, schema, "csv");
 * // "Name,Email\nJane,jane@example.com"
 *
 * const flat = exportFormData(response, schema, "flat");
 * // { name: "Jane", email: "jane@example.com", "address.city": "NYC" }
 * ```
 *
 * @since 1.4.0
 */
export function exportFormData(
  response: FormResponse,
  schema: FormEngineSchema,
  format: "json",
): string;
export function exportFormData(
  response: FormResponse,
  schema: FormEngineSchema,
  format: "csv",
): string;
export function exportFormData(
  response: FormResponse,
  schema: FormEngineSchema,
  format: "flat",
): Record<string, unknown>;
export function exportFormData(
  response: FormResponse,
  schema: FormEngineSchema,
  format: ExportFormat,
): string | Record<string, unknown> {
  switch (format) {
    case "json":
      return exportAsJson(response);
    case "csv":
      return exportAsCsv(response, schema);
    case "flat":
      return flattenValues(response.values);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

function exportAsJson(response: FormResponse): string {
  return JSON.stringify(
    {
      schemaId: response.schemaId,
      schemaVersion: response.schemaVersion,
      submittedAt: response.submittedAt,
      values: response.values,
      scores: response.scores,
      totalScore: response.totalScore,
      metadata: response.metadata,
    },
    null,
    2,
  );
}

function exportAsCsv(response: FormResponse, schema: FormEngineSchema): string {
  // Build field ID → label map from schema
  const labelMap = new Map<string, string>();
  for (const section of schema.sections) {
    for (const question of section.questions) {
      labelMap.set(question.id, question.label);
    }
  }

  const flat = flattenValues(response.values);
  const keys = Object.keys(flat);

  // Headers: use field label if available, otherwise use the key
  const headers = keys.map((k) => labelMap.get(k) ?? k);

  // Values: convert to CSV-safe strings
  const values = keys.map((k) => csvEscape(flat[k]));

  return headers.join(",") + "\n" + values.join(",");
}

/**
 * Flattens nested values into dot-notation keys.
 *
 * @example
 * `{ address: { city: "NYC", zip: "10001" } }` → `{ "address.city": "NYC", "address.zip": "10001" }`
 */
function flattenValues(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenValues(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = value;
    }
  }

  return result;
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = Array.isArray(value) ? value.join("; ") : String(value);
  // Wrap in quotes if the value contains commas, quotes, or newlines
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
