import type { FormEngineSchema } from "../types/schema";
import type { ValidationResult } from "../engine/create-engine";
import type { ValidatorRegistry } from "../validators/registry";
import { validateAll } from "../engine/validation-runner";

/**
 * Validate raw form values against a schema without instantiating a FormEngine.
 *
 * Runs the full synchronous validation pipeline:
 * - Required field checks (boolean and conditional)
 * - All 19 built-in validators (email, phone, min/max, pattern, etc.)
 * - Config-driven validation (matrix required, multi_select minSelections)
 * - Custom validators (when a ValidatorRegistry is provided)
 *
 * Skips:
 * - Non-input fields (divider, spacer, section_header, etc.)
 * - Hidden fields/sections (showIf evaluates to false)
 * - Async validators (require a running engine)
 *
 * Use this for server-side validation in API routes, server actions,
 * or anywhere you need to validate form data without a React/browser context.
 *
 * @param schema - The form schema to validate against.
 * @param values - Raw form values keyed by field ID.
 * @param registry - Optional validator registry for custom validators.
 * @returns ValidationResult with `valid`, `errors`, `firstErrorFieldId`, `firstErrorSectionId`.
 *
 * @example
 * ```ts
 * import { validateFormValues } from "@squaredr/fieldcraft-core";
 *
 * const result = validateFormValues(schema, submittedValues);
 * if (!result.valid) {
 *   // result.errors = { "email": ["Invalid email address"], "name": ["This field is required"] }
 *   console.log("First error:", result.firstErrorFieldId);
 * }
 * ```
 *
 * @since 1.8.1
 */
export function validateFormValues(
  schema: FormEngineSchema,
  values: Record<string, unknown>,
  registry?: ValidatorRegistry,
): ValidationResult {
  return validateAll(schema, values, registry);
}
