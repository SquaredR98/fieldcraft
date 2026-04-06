import type { Question, Section, FormEngineSchema } from "../types/schema";
import type { ConditionExpression } from "../types/conditions";
import type { ValidationResult } from "./create-engine";
import { runBuiltInRule } from "../validators/built-in";
import { evaluate } from "./condition-evaluator";
import type { ValidatorRegistry } from "../validators/registry";

/**
 * Validate a single field's value against its validation rules.
 * Returns an array of error message strings (empty array = valid).
 */
export function validateField(
  field: Question,
  value: unknown,
  allValues: Record<string, unknown>,
  registry?: ValidatorRegistry,
): string[] {
  const errors: string[] = [];

  // Check required (which can be boolean or conditional)
  if (field.required) {
    const isRequired =
      typeof field.required === "boolean"
        ? field.required
        : evaluate(field.required as ConditionExpression, allValues);

    if (isRequired) {
      const requiredError = runBuiltInRule({ type: "required" }, value);
      if (requiredError) {
        errors.push(requiredError);
        return errors; // If required fails, don't run other rules
      }
    }
  }

  // If value is empty and not required, skip remaining validations
  if (value === undefined || value === null || value === "") {
    return errors;
  }

  // Run explicit validation rules
  if (field.validation) {
    for (const rule of field.validation) {
      if (rule.type === "required") {
        // Already handled above
        continue;
      }

      if (rule.type === "custom") {
        // Run custom validator from registry
        if (registry) {
          const customFn = registry.getCustom(rule.name);
          if (customFn) {
            const error = customFn(value, allValues, rule.params);
            if (error) {
              errors.push(rule.message ?? error);
            }
          }
        }
        continue;
      }

      if (rule.type === "async") {
        // Async validators are skipped during synchronous validation.
        // They are run separately by the engine when needed.
        continue;
      }

      // Run built-in rule
      const error = runBuiltInRule(rule, value, allValues);
      if (error) {
        errors.push(error);
      }
    }
  }

  return errors;
}

/**
 * Validate a single field asynchronously (runs async validators).
 * Call this after synchronous validation passes.
 */
export async function validateFieldAsync(
  field: Question,
  value: unknown,
  registry?: ValidatorRegistry,
): Promise<string[]> {
  const errors: string[] = [];

  if (!field.validation || !registry) return errors;

  for (const rule of field.validation) {
    if (rule.type === "async") {
      const asyncFn = registry.getAsync(rule.endpoint);
      if (asyncFn) {
        const error = await asyncFn(value, undefined);
        if (error) {
          errors.push(rule.message ?? error);
        }
      }
    }
  }

  return errors;
}

/**
 * Validate all visible fields in a section.
 * Skips fields that are hidden (showIf evaluates to false).
 */
export function validateSection(
  section: Section,
  values: Record<string, unknown>,
  registry?: ValidatorRegistry,
): ValidationResult {
  const errors: Record<string, string[]> = {};
  let firstErrorFieldId: string | undefined;

  for (const field of section.questions) {
    // Skip hidden fields
    if (field.showIf && !evaluate(field.showIf, values)) {
      continue;
    }

    // Skip structural/non-input fields
    if (isStructuralField(field.type)) {
      continue;
    }

    const fieldErrors = validateField(field, values[field.id], values, registry);
    if (fieldErrors.length > 0) {
      errors[field.id] = fieldErrors;
      if (!firstErrorFieldId) {
        firstErrorFieldId = field.id;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstErrorFieldId,
    firstErrorSectionId: firstErrorFieldId ? section.id : undefined,
  };
}

/**
 * Validate all visible fields across all visible sections.
 */
export function validateAll(
  schema: FormEngineSchema,
  values: Record<string, unknown>,
  registry?: ValidatorRegistry,
): ValidationResult {
  const allErrors: Record<string, string[]> = {};
  let firstErrorFieldId: string | undefined;
  let firstErrorSectionId: string | undefined;

  for (const section of schema.sections) {
    // Skip hidden sections
    if (section.showIf && !evaluate(section.showIf, values)) {
      continue;
    }

    const result = validateSection(section, values, registry);
    Object.assign(allErrors, result.errors);

    if (!firstErrorFieldId && result.firstErrorFieldId) {
      firstErrorFieldId = result.firstErrorFieldId;
      firstErrorSectionId = section.id;
    }
  }

  return {
    valid: Object.keys(allErrors).length === 0,
    errors: allErrors,
    firstErrorFieldId,
    firstErrorSectionId,
  };
}

/** Structural field types that don't hold values and shouldn't be validated */
function isStructuralField(type: string): boolean {
  return ["section_header", "info_block", "page_break"].includes(type);
}
