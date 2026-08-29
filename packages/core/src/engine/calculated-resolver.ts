import { evaluateMathExpression, evaluateFunction } from "../utils/expression-parser";

/**
 * Result of evaluating a calculated field expression.
 *
 * - `value` is the numeric or string result, or `null` if evaluation failed.
 * - `warning` describes why evaluation failed (missing field, non-numeric value,
 *   division by zero, or malformed expression). Absent when evaluation succeeds.
 */
export type CalculatedResult = {
  value: number | string | null;
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
    const dotPattern = /\{([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)\}/g;
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

// ── Function-call expression support ────────────────────────────

/** Function names handled by evaluateFunction — used to detect function-call expressions. */
const EXPRESSION_FUNCTIONS = new Set([
  "IF", "UPPER", "LOWER", "TRIM", "LEN", "CONCAT",
  "TODAY", "DATEDIFF", "DATEADD",
]);

/**
 * Fast check: does the expression contain a known function call?
 * Only triggers the rich evaluation path when needed.
 */
function containsFunctionCall(expr: string): boolean {
  const upper = expr.toUpperCase();
  for (const fn of EXPRESSION_FUNCTIONS) {
    const idx = upper.indexOf(fn + "(");
    if (idx >= 0 && (idx === 0 || !/[A-Z]/i.test(upper[idx - 1]))) {
      return true;
    }
  }
  return false;
}

/**
 * Splits a function's argument string on commas at depth 0,
 * respecting parenthesis nesting and string literal boundaries.
 */
function splitFunctionArgs(argsStr: string): string[] {
  const args: string[] = [];
  let current = "";
  let depth = 0;
  let inString: string | null = null;

  for (let i = 0; i < argsStr.length; i++) {
    const ch = argsStr[i];

    if (inString) {
      current += ch;
      if (ch === inString) inString = null;
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = ch;
      current += ch;
      continue;
    }

    if (ch === "(") {
      depth++;
      current += ch;
      continue;
    }

    if (ch === ")") {
      depth--;
      current += ch;
      continue;
    }

    if (ch === "," && depth === 0) {
      args.push(current.trim());
      current = "";
      continue;
    }

    current += ch;
  }

  const last = current.trim();
  if (last.length > 0) args.push(last);
  return args;
}

/**
 * Finds a comparison operator in the expression at depth 0 (outside parens and strings).
 * Returns the operator and its position, or null if none found.
 * Checks two-char operators (!=, ==, >=, <=) before single-char (>, <, =).
 */
function findComparisonOp(
  expr: string,
): { op: string; pos: number } | null {
  let depth = 0;
  let inString: string | null = null;

  // Two passes: first for 2-char ops, then for 1-char ops
  for (const opSet of [["!=", "==", ">=", "<="], [">", "<", "="]] as const) {
    for (let i = 0; i < expr.length; i++) {
      const ch = expr[i];

      if (inString) {
        if (ch === inString) inString = null;
        continue;
      }
      if (ch === '"' || ch === "'") { inString = ch; continue; }
      if (ch === "(") { depth++; continue; }
      if (ch === ")") { depth--; continue; }

      if (depth === 0) {
        for (const op of opSet) {
          if (expr.substring(i, i + op.length) === op) {
            return { op, pos: i };
          }
        }
      }
    }
    // Reset for second pass
    depth = 0;
    inString = null;
  }

  return null;
}

/**
 * Evaluates a comparison expression (e.g., `{type} = "legal"`, `{age} > 18`).
 * Returns a boolean.
 */
function evaluateComparison(
  expr: string,
  values: Record<string, unknown>,
): boolean {
  const found = findComparisonOp(expr);
  if (!found) return Boolean(evaluateRichExpression(expr, values));

  const left = evaluateRichExpression(expr.substring(0, found.pos).trim(), values);
  const right = evaluateRichExpression(expr.substring(found.pos + found.op.length).trim(), values);

  switch (found.op) {
    case "=":
    case "==":
      // eslint-disable-next-line eqeqeq
      return left == right;
    case "!=":
      // eslint-disable-next-line eqeqeq
      return left != right;
    case ">": return Number(left) > Number(right);
    case "<": return Number(left) < Number(right);
    case ">=": return Number(left) >= Number(right);
    case "<=": return Number(left) <= Number(right);
    default: return false;
  }
}

/**
 * Recursive expression evaluator that handles function calls, string literals,
 * field references (preserving native types), comparisons, and math fallback.
 */
function evaluateRichExpression(
  expr: string,
  values: Record<string, unknown>,
): unknown {
  const trimmed = expr.trim();

  // 1. String literal: "..." or '...'
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  // 2. Bare field reference: {fieldId}
  if (/^\{[a-zA-Z0-9_-]+\}$/.test(trimmed)) {
    const fieldId = trimmed.slice(1, -1);
    return values[fieldId];
  }

  // 3. Numeric literal (no letters, no braces)
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  // 4. Boolean literals
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  // 5. Function call: FUNCNAME(...)
  const funcMatch = trimmed.match(/^([A-Za-z]+)\(([\s\S]*)\)$/);
  if (funcMatch) {
    const funcName = funcMatch[1].toUpperCase();
    const argsContent = funcMatch[2];

    if (EXPRESSION_FUNCTIONS.has(funcName)) {
      if (funcName === "IF") {
        // IF has special handling: first arg is a condition (comparison)
        const args = splitFunctionArgs(argsContent);
        if (args.length < 3) throw new Error("IF requires 3 arguments");
        const condition = evaluateComparison(args[0], values);
        const trueVal = evaluateRichExpression(args[1], values);
        const falseVal = evaluateRichExpression(args[2], values);
        return evaluateFunction(funcName, [condition, trueVal, falseVal]);
      }

      if (funcName === "TODAY") {
        return evaluateFunction(funcName, []);
      }

      const args = splitFunctionArgs(argsContent);
      const resolvedArgs = args.map((a) => evaluateRichExpression(a, values));
      return evaluateFunction(funcName, resolvedArgs);
    }
  }

  // 6. Contains comparison operator (outside a function call) → evaluate as comparison
  if (findComparisonOp(trimmed)) {
    return evaluateComparison(trimmed, values);
  }

  // 7. Math fallback: substitute {fieldId} → number, run evaluateMathExpression
  const fieldRefPattern = /\{([a-zA-Z0-9_-]+)\}/g;
  let substituted = trimmed;
  let match: RegExpExecArray | null;
  const refs: string[] = [];
  while ((match = fieldRefPattern.exec(trimmed)) !== null) {
    refs.push(match[1]);
  }

  for (const ref of refs) {
    const value = values[ref];
    if (value === undefined || value === null) {
      throw new Error(`Field "{${ref}}" has no value`);
    }
    const num = Number(value);
    if (isNaN(num)) {
      throw new Error(`Field "{${ref}}" is not a number (got "${String(value)}")`);
    }
    substituted = substituted.replaceAll(`{${ref}}`, String(num));
  }

  return evaluateMathExpression(substituted);
}

// ── Main evaluator ──────────────────────────────────────────────

/**
 * Evaluates a calculated field expression by replacing field references
 * with their values, then evaluating the resulting expression.
 *
 * Field references use the format: `{fieldId}`
 * Repeater sub-field references use: `{repeaterId.subFieldId}`
 * Aggregate functions: `SUM({r.f})`, `AVG({r.f})`, `COUNT({r.f})`,
 *   `MIN({r.f})`, `MAX({r.f})`, `SUM({r.a} * {r.b})`
 * String/date/conditional functions: `IF(cond, a, b)`, `UPPER({f})`,
 *   `LOWER({f})`, `CONCAT(a, b)`, `TODAY()`, `DATEDIFF()`, `DATEADD()`
 *
 * Examples:
 *   "{height} * 703 / ({weight} ^ 2)"
 *   "SUM({items.price} * {items.quantity})"
 *   "IF({type} = \"legal\", {rate} * 2, {rate})"
 *   "UPPER({name})"
 *
 * Returns `{ value, warning }`. On success, `value` is the number or string
 * and `warning` is absent. On failure, `value` is `null` and `warning`
 * describes the problem.
 */
export function evaluateExpression(
  expression: string,
  values: Record<string, unknown>,
): CalculatedResult {
  const MAX_EXPRESSION_LENGTH = 10_000;
  if (expression.length > MAX_EXPRESSION_LENGTH) {
    return {
      value: null,
      warning: `Expression exceeds maximum length (${MAX_EXPRESSION_LENGTH} chars)`,
    };
  }

  // Step 1: Resolve aggregate functions (SUM, AVG, etc.) over repeater sub-fields
  const { result: afterAggregates, warning: aggWarning } = resolveAggregates(expression, values);
  if (aggWarning) {
    return { value: null, warning: aggWarning };
  }

  // Step 2: If the expression contains function calls (IF, UPPER, etc.),
  // route to the recursive rich evaluator
  if (containsFunctionCall(afterAggregates)) {
    try {
      const result = evaluateRichExpression(afterAggregates, values);
      if (result === null || result === undefined) {
        return { value: null, warning: `Expression "${expression}" evaluated to null` };
      }
      if (typeof result === "number") {
        if (!isFinite(result)) {
          return { value: null, warning: `Expression "${expression}" produced a non-finite result` };
        }
        return { value: result };
      }
      if (typeof result === "string") {
        return { value: result };
      }
      return { value: String(result) };
    } catch (e) {
      return {
        value: null,
        warning: `Expression "${expression}" is invalid: ${e instanceof Error ? e.message : "unknown error"}`,
      };
    }
  }

  // Step 3: Math-only path — resolve field references as numbers
  const fieldRefPattern = /\{([a-zA-Z0-9_-]+)\}/g;
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
  const simplePattern = /\{([a-zA-Z0-9_-]+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = simplePattern.exec(expression)) !== null) {
    refs.add(match[1]);
  }

  // Repeater refs: {repeaterId.subFieldId} → add repeaterId as dependency
  const dotPattern = /\{([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)\}/g;
  while ((match = dotPattern.exec(expression)) !== null) {
    refs.add(match[1]);
  }

  return [...refs];
}
