import type { FormEngineSchema } from "../types/schema";
import type { PrefillConfig } from "../types/settings";

/**
 * Resolve prefill values from multiple sources.
 * Priority (highest to lowest): props > URL params > schema defaults
 *
 * @param schema - The form schema (for extracting default values and prefillKeys)
 * @param prefillValues - Values passed as props
 * @param prefillConfig - Prefill configuration from schema settings
 * @returns Merged values record
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
 * Extract URL query parameters filtered by prefix.
 * Only available in browser environments.
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
