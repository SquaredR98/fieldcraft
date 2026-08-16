import type { ConditionExpression, ConditionOperator } from "../types/conditions";

/**
 * Evaluates a condition expression against current form values.
 * Used by the engine to determine field/section visibility (`showIf`).
 *
 * Supports two node types:
 * - **Leaf**: `{ field, operator, value }` — evaluates a single comparison
 * - **Group**: `{ conditions[], combine }` — recursively evaluates children
 *   with AND (all must pass) or OR (any must pass)
 *
 * Returns `true` for empty or malformed expressions (safe default: show the field).
 *
 * @param expression - The condition tree to evaluate
 * @param values - Current form values keyed by field ID
 * @returns Whether the condition is satisfied
 *
 * @example
 * ```ts
 * evaluate({ field: "age", operator: "gte", value: 18 }, { age: 21 }); // true
 * evaluate({
 *   combine: "OR",
 *   conditions: [
 *     { field: "role", operator: "eq", value: "admin" },
 *     { field: "role", operator: "eq", value: "editor" },
 *   ],
 * }, { role: "editor" }); // true
 * ```
 */
export function evaluate(
  expression: ConditionExpression,
  values: Record<string, unknown>,
): boolean {
  // Empty expression → always visible
  if (!expression || (expression.field === undefined && !expression.conditions)) {
    return true;
  }

  // Group node: evaluate children with AND/OR
  if (expression.conditions && expression.conditions.length > 0) {
    const combine = expression.combine ?? "AND";
    if (combine === "AND") {
      return expression.conditions.every((child) => evaluate(child, values));
    } else {
      return expression.conditions.some((child) => evaluate(child, values));
    }
  }

  // Leaf node: evaluate field + operator
  if (expression.field !== undefined && expression.operator !== undefined) {
    const fieldValue = values[expression.field];
    return evaluateOperator(expression.operator, fieldValue, expression.value);
  }

  // Fallback: malformed expression → treat as true
  return true;
}

/**
 * Evaluates a single operator comparison between a field's runtime value
 * and the condition's target value. Supports 25 operators:
 * eq, neq, gt, gte, lt, lte, in, notIn, exists, notExists,
 * isEmpty, isNotEmpty, contains, notContains, startsWith, endsWith,
 * between, matches, matchesRegex, dateAfter, dateBefore,
 * arrayContains, arrayNotContains, lengthGreaterThan, lengthLessThan.
 */
function evaluateOperator(
  operator: ConditionOperator,
  fieldValue: unknown,
  conditionValue: unknown,
): boolean {
  switch (operator) {
    case "eq":
      return fieldValue === conditionValue;

    case "neq":
      return fieldValue !== conditionValue;

    case "gt":
      return toNumber(fieldValue) > toNumber(conditionValue);

    case "gte":
      return toNumber(fieldValue) >= toNumber(conditionValue);

    case "lt":
      return toNumber(fieldValue) < toNumber(conditionValue);

    case "lte":
      return toNumber(fieldValue) <= toNumber(conditionValue);

    case "in":
      if (!Array.isArray(conditionValue)) return false;
      return conditionValue.includes(fieldValue);

    case "notIn":
      if (!Array.isArray(conditionValue)) return true;
      return !conditionValue.includes(fieldValue);

    case "exists":
    case "isNotEmpty":
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== "";

    case "notExists":
    case "isEmpty":
      return fieldValue === undefined || fieldValue === null || fieldValue === "";

    case "contains":
      return String(fieldValue ?? "").includes(String(conditionValue ?? ""));

    case "notContains":
      return !String(fieldValue ?? "").includes(String(conditionValue ?? ""));

    case "startsWith":
      return String(fieldValue ?? "").startsWith(String(conditionValue ?? ""));

    case "endsWith":
      return String(fieldValue ?? "").endsWith(String(conditionValue ?? ""));

    case "between": {
      if (!Array.isArray(conditionValue) || conditionValue.length !== 2) return false;
      const num = toNumber(fieldValue);
      const [min, max] = conditionValue.map(toNumber);
      return num >= min && num <= max;
    }

    case "matches":
    case "matchesRegex": {
      try {
        const regex = new RegExp(String(conditionValue ?? ""));
        return regex.test(String(fieldValue ?? ""));
      } catch {
        return false;
      }
    }

    case "dateAfter": {
      const fieldDate = toDate(fieldValue);
      const condDate = toDate(conditionValue);
      if (!fieldDate || !condDate) return false;
      return fieldDate.getTime() > condDate.getTime();
    }

    case "dateBefore": {
      const fieldDate = toDate(fieldValue);
      const condDate = toDate(conditionValue);
      if (!fieldDate || !condDate) return false;
      return fieldDate.getTime() < condDate.getTime();
    }

    case "arrayContains":
      if (!Array.isArray(fieldValue)) return false;
      return fieldValue.includes(conditionValue);

    case "arrayNotContains":
      if (!Array.isArray(fieldValue)) return true;
      return !fieldValue.includes(conditionValue);

    case "lengthGreaterThan": {
      const len = getLength(fieldValue);
      return len > toNumber(conditionValue);
    }

    case "lengthLessThan": {
      const len = getLength(fieldValue);
      return len < toNumber(conditionValue);
    }

    default:
      return false;
  }
}

/** Coerces a value to a number. Returns 0 for non-numeric values. */
function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/** Parses a value into a Date. Returns null for invalid dates. */
function toDate(value: unknown): Date | null {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/** Returns the length of a string or array, 0 for other types. */
function getLength(value: unknown): number {
  if (typeof value === "string") return value.length;
  if (Array.isArray(value)) return value.length;
  return 0;
}
