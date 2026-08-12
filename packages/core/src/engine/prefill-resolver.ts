import type { FormEngineSchema } from "../types/schema";
import type { PrefillConfig } from "../types/settings";

/**
 * Resolves initial field values by merging three sources in priority order:
 *
 * 1. **Schema defaults** (lowest) — `defaultValue` in each question's config
 * 2. **URL parameters** (middle) — query params matching `prefillConfig.paramPrefix`
 * 3. **Props values** (highest) — values passed directly via `prefillValues`
 *
 * Fields use `question.prefillKey` as the lookup key in URL params and props.
 * If `prefillKey` is not set, `question.id` is used as the fallback key.
 *
 * @param schema - The form schema (provides default values and prefillKey mappings)
 * @param prefillValues - Values passed as component props (highest priority)
 * @param prefillConfig - Controls which sources are active (`"props"`, `"url"`, or `"both"`)
 *   and optional param prefix / transform function
 * @returns Merged values record keyed by field ID
 *
 * @example
 * ```ts
 * // URL: ?fe_name=John&fe_email=john@example.com
 * const values = resolvePrefill(schema, { name: "Jane" }, {
 *   source: "both",
 *   paramPrefix: "fe_",
 * });
 * // values.name === "Jane" (props wins over URL)
 * // values.email === "john@example.com" (from URL)
 * ```
 */
export function resolvePrefill(
  schema: FormEngineSchema,
  prefillValues?: Record<string, unknown>,
  prefillConfig?: PrefillConfig,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  // Layer 1: Schema defaults (lowest priority)
  for (const section of schema.sections) {
    for (const question of section.questions) {
      if (question.config && typeof question.config === "object" && "defaultValue" in question.config) {
        result[question.id] = (question.config as { defaultValue: unknown }).defaultValue;
      }
    }
  }

  // Layer 2: URL params (if configured and available)
  if (prefillConfig && (prefillConfig.source === "url" || prefillConfig.source === "both")) {
    const urlParams = getUrlParams(prefillConfig.paramPrefix ?? "fe_");

    // Apply transform if provided
    const transformed = prefillConfig.transform ? prefillConfig.transform(urlParams) : urlParams;

    // Map URL params to field IDs using prefillKey
    for (const section of schema.sections) {
      for (const question of section.questions) {
        const key = question.prefillKey ?? question.id;
        if (key in transformed) {
          result[question.id] = transformed[key];
        }
      }
    }
  }

  // Layer 3: Props values (highest priority)
  if (prefillValues && (
    !prefillConfig ||
    prefillConfig.source === "props" ||
    prefillConfig.source === "both"
  )) {
    for (const section of schema.sections) {
      for (const question of section.questions) {
        const key = question.prefillKey ?? question.id;
        if (key in prefillValues) {
          result[question.id] = prefillValues[key];
        }
      }
    }
  }

  return result;
}

/**
 * Extracts URL query parameters that start with the given prefix,
 * stripping the prefix from each key. Browser-only — returns an
 * empty object in server/Node environments.
 *
 * @example `getUrlParams("fe_")` with URL `?fe_name=John` → `{ name: "John" }`
 */
function getUrlParams(prefix: string): Record<string, string> {
  const params: Record<string, string> = {};

  if (typeof window === "undefined" || typeof URLSearchParams === "undefined") {
    return params;
  }

  try {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, key) => {
      if (key.startsWith(prefix)) {
        // Strip prefix: "fe_name" → "name"
        const fieldKey = key.slice(prefix.length);
        params[fieldKey] = value;
      }
    });
  } catch {
    // Silently fail in non-browser environments
  }

  return params;
}
