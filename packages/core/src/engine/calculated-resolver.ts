import { evaluateMathExpression } from "../utils/expression-parser";

/**
 * Result of evaluating a calculated field expression.
 *
 * - `value` is the numeric result, or `null` if evaluation failed.
 * - `warning` describes why evaluation failed (missing field, non-numeric value,
 *   division by zero, or malformed expression). Absent when evaluation succeeds.
 */
export type CalculatedResult = {
  value: number | null;
  warning?: string;
};

/**
 * Evaluates a calculated field expression by replacing field references
 * with their values, then evaluating the resulting math expression.
 *
 * Field references use the format: {fieldId}
 * Example: "{height} * 703 / ({weight} ^ 2)"
 *
 * Returns `{ value, warning }`. On success, `value` is the number and
 * `warning` is absent. On failure, `value` is `null` and `warning`
 * describes the problem.
 */
export function evaluateExpression(
  expression: string,
  values: Record<string, unknown>,
): CalculatedResult {
  // Extract field references: {fieldId}
  const fieldRefPattern = /\{(\w+)\}/g;
  let substituted = expression;
  let match: RegExpExecArray | null;

  // Check all referenced fields exist and are numeric
  const refs: string[] = [];
  while ((match = fieldRefPattern.exec(expression)) !== null) {
    refs.push(match[1]);
  }

  for (const ref of refs) {
    const value = values[ref];
    if (value === undefined || value === null) {
      return {
        value: null,
        warning: `Field "{${ref}}" has no value`,
      };
    }
    const num = Number(value);
    if (isNaN(num)) {
      return {
        value: null,
        warning: `Field "{${ref}}" is not a number (got "${String(value)}")`,
      };
    }
    // Replace all occurrences of {ref} with the numeric value
    substituted = substituted.replaceAll(`{${ref}}`, String(num));
  }

  try {
    const result = evaluateMathExpression(substituted);
    if (!isFinite(result)) {
      return {
        value: null,
        warning: `Expression "${expression}" produced a non-finite result (division by zero)`,
      };
    }
    return { value: result };
  } catch (e) {
    return {
      value: null,
      warning: `Expression "${expression}" is invalid: ${e instanceof Error ? e.message : "unknown error"}`,
    };
  }
}

/**
 * Extract field IDs referenced in an expression.
 * Used to build the dependency graph.
 */
export function extractFieldRefs(expression: string): string[] {
  const refs: string[] = [];
  const pattern = /\{(\w+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(expression)) !== null) {
    refs.push(match[1]);
  }
  return [...new Set(refs)];
}
