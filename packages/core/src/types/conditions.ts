export type ConditionExpression = {
  combine?: "AND" | "OR";
  conditions?: ConditionExpression[];
  field?: string;
  operator?: ConditionOperator;
  value?: unknown;
};

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
