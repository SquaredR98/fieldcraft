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

// ── Aggregate helpers ───────────────────────────────────────────

/**
 * Extracts numeric values from a repeater field's sub-field entries.
 * Given `values[repeaterId]` as `Array<Record<string, unknown>>`,
 * collects `Number(entry[subFieldId])` for each entry where the value
 * is present and numeric.
 */
function extractRepeaterNumbers(
  values: Record<string, unknown>,
  repeaterId: string,
  subFieldId: string,
): number[] | null {
  const entries = values[repeaterId];
  if (!Array.isArray(entries)) return null;
  const nums: number[] = [];
  for (const entry of entries) {
    if (entry == null || typeof entry !== "object") continue;
    const val = (entry as Record<string, unknown>)[subFieldId];
    if (val === undefined || val === null) continue;
    const n = Number(val);
    if (!isNaN(n)) nums.push(n);
  }
  return nums;
}

/**
 * Resolves aggregate function calls that reference repeater sub-fields.
 *
 * Supported patterns:
 * - `SUM({repeaterId.subFieldId})`
 * - `AVG({repeaterId.subFieldId})`
 * - `COUNT({repeaterId.subFieldId})`
 * - `MIN({repeaterId.subFieldId})`
 * - `MAX({repeaterId.subFieldId})`
 *
 * Also supports product expressions inside aggregates:
 * - `SUM({repeaterId.fieldA} * {repeaterId.fieldB})`
 *
 * These are pre-resolved to numeric literals before the expression
 * reaches the math evaluator.
 */
function resolveAggregates(
  expression: string,
  values: Record<string, unknown>,
): { result: string; warning?: string } {
  // Match: FUNC({repeater.sub} ... ) — supports nested math inside the aggregate
  const aggregatePattern = /\b(SUM|AVG|COUNT|MIN|MAX)\(([^)]+)\)/gi;
  let result = expression;
  let aggMatch: RegExpExecArray | null;

  // Reset lastIndex for global regex
  aggregatePattern.lastIndex = 0;

  while ((aggMatch = aggregatePattern.exec(expression)) !== null) {
    const funcName = aggMatch[1].toUpperCase();
    const innerExpr = aggMatch[2].trim();
    const fullMatch = aggMatch[0];

    // Find all repeater.sub references inside this aggregate
    const dotRefs: Array<{ repeaterId: string; subFieldId: string; fullRef: string }> = [];
    const dotPattern = /\{(\w+)\.(\w+)\}/g;
    let dotMatch: RegExpExecArray | null;
    while ((dotMatch = dotPattern.exec(innerExpr)) !== null) {
      dotRefs.push({
        repeaterId: dotMatch[1],
        subFieldId: dotMatch[2],
        fullRef: dotMatch[0],
      });
    }

    if (dotRefs.length === 0) {
      // No repeater refs — might be a simple aggregate like SUM(1, 2, 3)
      // Skip; let the math evaluator handle it or fail gracefully
      continue;
    }

    // All dot-refs must reference the same repeater
    const repeaterId = dotRefs[0].repeaterId;
    if (dotRefs.some((r) => r.repeaterId !== repeaterId)) {
      return {
        result: expression,
        warning: `Aggregate ${funcName} references multiple repeaters — only one repeater per aggregate is supported`,
      };
    }

    const entries = values[repeaterId];
    if (!Array.isArray(entries) || entries.length === 0) {
      // No entries → aggregate is 0 (SUM/COUNT) or null (AVG/MIN/MAX)
      const zeroResult = funcName === "COUNT" || funcName === "SUM" ? "0" : "0";
      result = result.replace(fullMatch, zeroResult);
      continue;
    }

    if (dotRefs.length === 1 && innerExpr.trim() === dotRefs[0].fullRef) {
      // Simple case: SUM({items.price}) — just aggregate the sub-field values
      const nums = extractRepeaterNumbers(values, repeaterId, dotRefs[0].subFieldId);
      if (nums === null || nums.length === 0) {
        result = result.replace(fullMatch, "0");
        continue;
      }
      const aggregated = applyAggregate(funcName, nums);
      result = result.replace(fullMatch, String(aggregated));
    } else {
      // Complex case: SUM({items.price} * {items.qty})
      // Evaluate the inner expression per-row, then aggregate
      const rowResults: number[] = [];
      for (const entry of entries) {
        if (entry == null || typeof entry !== "object") continue;
        const row = entry as Record<string, unknown>;
        let rowExpr = innerExpr;
        let skip = false;
        for (const ref of dotRefs) {
          const val = row[ref.subFieldId];
          if (val === undefined || val === null) { skip = true; break; }
          const n = Number(val);
          if (isNaN(n)) { skip = true; break; }
          rowExpr = rowExpr.replaceAll(ref.fullRef, String(n));
        }
        if (skip) continue;
        try {
          const rowVal = evaluateMathExpression(rowExpr);
          if (isFinite(rowVal)) rowResults.push(rowVal);
        } catch {
          // Skip rows with invalid math
        }
      }
      const aggregated = rowResults.length > 0 ? applyAggregate(funcName, rowResults) : 0;
      result = result.replace(fullMatch, String(aggregated));
    }
  }

  return { result };
}

function applyAggregate(func: string, nums: number[]): number {
  switch (func) {
    case "SUM": return nums.reduce((a, b) => a + b, 0);
    case "AVG": return nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
    case "COUNT": return nums.length;
    case "MIN": return Math.min(...nums);
    case "MAX": return Math.max(...nums);
    default: return 0;
  }
}

// ── Main evaluator ──────────────────────────────────────────────

/**
 * Evaluates a calculated field expression by replacing field references
 * with their values, then evaluating the resulting math expression.
 *
 * Field references use the format: `{fieldId}`
 * Repeater sub-field references use: `{repeaterId.subFieldId}`
 * Aggregate functions: `SUM({r.f})`, `AVG({r.f})`, `COUNT({r.f})`,
 *   `MIN({r.f})`, `MAX({r.f})`, `SUM({r.a} * {r.b})`
 *
 * Examples:
 *   "{height} * 703 / ({weight} ^ 2)"
 *   "SUM({items.price} * {items.quantity})"
 *   "{subtotal} * 0.085"
 *
 * Returns `{ value, warning }`. On success, `value` is the number and
 * `warning` is absent. On failure, `value` is `null` and `warning`
 * describes the problem.
 */
export function evaluateExpression(
  expression: string,
  values: Record<string, unknown>,
): CalculatedResult {
  // Step 1: Resolve aggregate functions (SUM, AVG, etc.) over repeater sub-fields
  const { result: afterAggregates, warning: aggWarning } = resolveAggregates(expression, values);
  if (aggWarning) {
    return { value: null, warning: aggWarning };
  }

  // Step 2: Resolve remaining simple field references: {fieldId}
  const fieldRefPattern = /\{(\w+)\}/g;
  let substituted = afterAggregates;
  let match: RegExpExecArray | null;

  const refs: string[] = [];
  while ((match = fieldRefPattern.exec(afterAggregates)) !== null) {
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
 *
 * Handles both simple refs `{fieldId}` and repeater refs `{repeaterId.subFieldId}`
 * (returns the repeater parent ID for dependency tracking).
 */
export function extractFieldRefs(expression: string): string[] {
  const refs = new Set<string>();

  // Simple refs: {fieldId}
  const simplePattern = /\{(\w+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = simplePattern.exec(expression)) !== null) {
    refs.add(match[1]);
  }

  // Repeater refs: {repeaterId.subFieldId} → add repeaterId as dependency
  const dotPattern = /\{(\w+)\.(\w+)\}/g;
  while ((match = dotPattern.exec(expression)) !== null) {
    refs.add(match[1]);
  }

  return [...refs];
}
