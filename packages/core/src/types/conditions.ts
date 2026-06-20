/**
 * Recursive conditional expression used for `showIf`, `disabled`, conditional
 * `required`, and section exit jump rules.
 *
 * @description A leaf expression compares a field's value using an operator.
 * A branch expression combines child expressions with AND/OR logic.
 * Nesting is unlimited — you can build arbitrarily complex conditions.
 *
 * @example
 * ```typescript
 * // Leaf: show field when country is "US"
 * const leaf: ConditionExpression = {
 *   field: "country",
 *   operator: "eq",
 *   value: "US",
 * };
 *
 * // Branch: show when country is "US" AND age >= 18
 * const branch: ConditionExpression = {
 *   combine: "AND",
 *   conditions: [
 *     { field: "country", operator: "eq", value: "US" },
 *     { field: "age", operator: "gte", value: 18 },
 *   ],
 * };
 * ```
 *
 * @since 1.0.0
 */
export type ConditionExpression = {
  /** How to combine child conditions. Omit for leaf expressions. */
  combine?: "AND" | "OR";
  /** Child condition expressions. Used when `combine` is set. */
  conditions?: ConditionExpression[];
  /** Field ID to evaluate. Used in leaf expressions. */
  field?: string;
  /** Comparison operator. Used in leaf expressions. */
  operator?: ConditionOperator;
  /** Value to compare against. Type depends on the operator. */
  value?: unknown;
};

/**
 * All available comparison operators for condition expressions.
 *
 * @description
 * - `eq` / `neq` — equals / not equals (strict comparison)
 * - `gt` / `gte` / `lt` / `lte` — numeric comparisons
 * - `in` / `notIn` — value is in / not in an array
 * - `exists` / `notExists` — field has / does not have a value
 * - `contains` / `notContains` — string/array contains value
 * - `startsWith` / `endsWith` — string prefix/suffix matching
 * - `between` — value is within a [min, max] range
 * - `matches` — value matches a regex pattern
 *
 * @since 1.0.0
 */
export type ConditionOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "notIn"
  | "exists"
  | "notExists"
  | "contains"
  | "notContains"
  | "startsWith"
  | "endsWith"
  | "between"
  | "matches";
