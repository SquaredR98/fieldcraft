import type { ConditionExpression, ConditionOperator } from "../types/conditions";

/**
 * Evaluates a condition expression against current form values.
 * Pure function — no side effects.
 *
 * Rules:
 * - Leaf node (field + operator): evaluate directly
 * - Group node (conditions[]): evaluate each child, combine with AND/OR
 * - Empty expression (no field, no conditions): returns true
 * - Missing field in values: treat as undefined
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
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== "";

    case "notExists":
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

    case "matches": {
      try {
        const regex = new RegExp(String(conditionValue ?? ""));
        return regex.test(String(fieldValue ?? ""));
      } catch {
        return false;
      }
    }

    default:
      return false;
  }
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}
