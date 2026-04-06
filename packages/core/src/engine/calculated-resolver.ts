import { evaluateMathExpression } from "../utils/expression-parser";

/**
 * Evaluates a calculated field expression by replacing field references
 * with their values, then evaluating the resulting math expression.
 *
 * Field references use the format: {fieldId}
 * Example: "{height} * 703 / ({weight} ^ 2)"
 *
 * Returns null if any referenced field is missing or non-numeric.
 */
export function evaluateExpression(
  expression: string,
  values: Record<string, unknown>,
): number | null {
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
    if (value === undefined || value === null) return null;
    const num = Number(value);
    if (isNaN(num)) return null;
    // Replace all occurrences of {ref} with the numeric value
    substituted = substituted.replaceAll(`{${ref}}`, String(num));
  }

  try {
    return evaluateMathExpression(substituted);
  } catch {
    return null;
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
