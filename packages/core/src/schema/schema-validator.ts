import { z } from "zod";
import type { FormEngineSchema } from "../types/schema";

// ---- Condition Expression (recursive) ----

const conditionOperator = z.enum([
  "eq", "neq", "gt", "gte", "lt", "lte",
  "in", "notIn", "exists", "notExists",
  "contains", "notContains", "startsWith", "endsWith",
  "between", "matches",
]);

const conditionExpression: z.ZodType<unknown> = z.lazy(() =>
  z.object({
    combine: z.enum(["AND", "OR"]).optional(),
    conditions: z.array(conditionExpression).optional(),
    field: z.string().optional(),
    operator: conditionOperator.optional(),
    value: z.unknown().optional(),
  }).refine(
    (expr) => {
      // Must be either a leaf (field+operator) or a group (conditions)
      const isLeaf = expr.field !== undefined && expr.operator !== undefined;
      const isGroup = expr.conditions !== undefined && expr.conditions.length > 0;
      const isEmpty = expr.field === undefined && expr.conditions === undefined;
      return isLeaf || isGroup || isEmpty;
    },
    { message: "Condition must be a leaf (field+operator), a group (conditions[]), or empty" }
  )
);

// ---- Validation Rules ----

const validationRule = z.discriminatedUnion("type", [
  z.object({ type: z.literal("required"), message: z.string().optional() }),
  z.object({ type: z.literal("min"), value: z.number(), message: z.string().optional() }),
  z.object({ type: z.literal("max"), value: z.number(), message: z.string().optional() }),
  z.object({ type: z.literal("minLength"), value: z.number(), message: z.string().optional() }),
  z.object({ type: z.literal("maxLength"), value: z.number(), message: z.string().optional() }),
  z.object({ type: z.literal("pattern"), regex: z.string(), flags: z.string().optional(), message: z.string().optional() }),
  z.object({ type: z.literal("email"), message: z.string().optional() }),
  z.object({ type: z.literal("phone"), message: z.string().optional() }),
  z.object({ type: z.literal("url"), message: z.string().optional() }),
  z.object({ type: z.literal("date"), min: z.string().optional(), max: z.string().optional(), message: z.string().optional() }),
  z.object({ type: z.literal("fileSize"), maxMb: z.number(), message: z.string().optional() }),
  z.object({ type: z.literal("fileType"), accept: z.array(z.string()), message: z.string().optional() }),
  z.object({ type: z.literal("custom"), name: z.string(), params: z.record(z.unknown()).optional(), message: z.string().optional() }),
  z.object({ type: z.literal("async"), endpoint: z.string(), debounceMs: z.number().optional(), message: z.string().optional() }),
]);

// ---- Question Config (permissive — each type has its own shape but we validate loosely) ----
// We use passthrough so extra fields from vertical packs are allowed.

const questionConfig = z.object({
  type: z.string(),
}).passthrough();

// ---- Option ----

const optionSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()]),
  helpText: z.string().optional(),
  icon: z.string().optional(),
  exclusive: z.boolean().optional(),
});

// ---- Question Layout ----

const questionLayout = z.object({
  width: z.enum(["full", "half", "third"]).optional(),
  columns: z.number().optional(),
});

// ---- Question ----

const questionSchema = z.object({
  id: z.string().min(1, "Question ID is required"),
  type: z.string().min(1, "Question type is required"),
  label: z.string(),
  helpText: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.union([z.boolean(), conditionExpression]).optional(),
  showIf: conditionExpression.optional(),
  disabled: z.union([z.boolean(), conditionExpression]).optional(),
  validation: z.array(validationRule).optional(),
  prefillKey: z.string().optional(),
  config: questionConfig.optional(),
  options: z.array(optionSchema).optional(),
  layout: questionLayout.optional(),
});

// ---- Jump Rule + Section Exit ----

const jumpRule = z.object({
  condition: conditionExpression,
  jumpTo: z.string().min(1),
});

const sectionExitAction = z.object({
  rules: z.array(jumpRule),
  default: z.string().optional(),
});

// ---- Section ----

const sectionSchema = z.object({
  id: z.string().min(1, "Section ID is required"),
  title: z.string(),
  description: z.string().optional(),
  showIf: conditionExpression.optional(),
  questions: z.array(questionSchema).min(1, "Section must have at least one question"),
  onExit: sectionExitAction.optional(),
});

// ---- Branding ----

const brandingConfig = z.object({
  logoUrl: z.string().optional(),
  logoAlt: z.string().optional(),
  faviconUrl: z.string().optional(),
  poweredBy: z.boolean().optional(),
});

// ---- Settings ----

const prefillConfig = z.object({
  source: z.enum(["props", "url", "both"]),
  paramPrefix: z.string().optional(),
  // transform is a function — can't validate with Zod, skipped
});

const formSettings = z.object({
  displayMode: z.enum(["classic", "stepped"]).optional(),
  allowDraftSave: z.boolean().optional(),
  draftStorage: z.enum(["local", "server", "both"]).optional(),
  draftTtlHours: z.number().optional(),
  showProgress: z.boolean().optional(),
  progressStyle: z.enum(["bar", "steps", "percentage"]).optional(),
  prefill: prefillConfig.optional(),
  noPiiInLogs: z.boolean().optional(),
  locale: z.string().optional(),
  submitButton: z.object({
    label: z.string().optional(),
    loadingLabel: z.string().optional(),
    successLabel: z.string().optional(),
  }).optional(),
  navigation: z.object({
    showBack: z.boolean().optional(),
    showSectionList: z.boolean().optional(),
    nextLabel: z.string().optional(),
    backLabel: z.string().optional(),
    allowSkip: z.boolean().optional(),
  }).optional(),
});

// ---- Submit / Complete actions ----

const submitAction = z.object({
  type: z.enum(["http", "callback", "adapter"]),
  url: z.string().optional(),
  method: z.enum(["POST", "PUT", "PATCH"]).optional(),
  headers: z.record(z.string()).optional(),
});

const completeAction = z.object({
  type: z.enum(["redirect", "message", "callback"]),
  url: z.string().optional(),
  message: z.string().optional(),
  showSummary: z.boolean().optional(),
});

// ---- Root Schema ----

const formEngineSchemaZod = z.object({
  id: z.string().min(1, "Schema ID is required"),
  version: z.string().min(1, "Schema version is required"),
  title: z.string().min(1, "Schema title is required"),
  description: z.string().optional(),
  branding: brandingConfig.optional(),
  settings: formSettings.optional(),
  sections: z.array(sectionSchema).min(1, "Schema must have at least one section"),
  submitAction: submitAction,
  onComplete: completeAction.optional(),
});

// ---- Custom Error Class ----

export class FormEngineSchemaError extends Error {
  public readonly issues: z.ZodIssue[];

  constructor(issues: z.ZodIssue[]) {
    const messages = issues.map(
      (i) => `  - ${i.path.join(".")}: ${i.message}`
    );
    super(`Invalid FormEngine schema:\n${messages.join("\n")}`);
    this.name = "FormEngineSchemaError";
    this.issues = issues;
  }
}

// ---- Cross-field validations ----

function validateCrossReferences(schema: FormEngineSchema): string[] {
  const errors: string[] = [];
  const sectionIds = new Set<string>();
  const questionIds = new Set<string>();

  // Collect all IDs and check for duplicates
  for (const section of schema.sections) {
    if (sectionIds.has(section.id)) {
      errors.push(`Duplicate section ID: "${section.id}"`);
    }
    sectionIds.add(section.id);

    for (const question of section.questions) {
      if (questionIds.has(question.id)) {
        errors.push(`Duplicate question ID: "${question.id}"`);
      }
      questionIds.add(question.id);
    }
  }

  // Validate condition field references
  function checkConditionRefs(expr: unknown, path: string): void {
    if (!expr || typeof expr !== "object") return;
    const cond = expr as Record<string, unknown>;
    if (typeof cond.field === "string" && !questionIds.has(cond.field)) {
      errors.push(`${path}: condition references unknown field "${cond.field}"`);
    }
    if (Array.isArray(cond.conditions)) {
      for (let i = 0; i < cond.conditions.length; i++) {
        checkConditionRefs(cond.conditions[i], `${path}.conditions[${i}]`);
      }
    }
  }

  // Validate jumpTo references
  for (const section of schema.sections) {
    if (section.showIf) {
      checkConditionRefs(section.showIf, `sections[${section.id}].showIf`);
    }

    if (section.onExit) {
      for (let i = 0; i < section.onExit.rules.length; i++) {
        const rule = section.onExit.rules[i];
        if (!sectionIds.has(rule.jumpTo)) {
          errors.push(
            `sections[${section.id}].onExit.rules[${i}].jumpTo: references unknown section "${rule.jumpTo}"`
          );
        }
        checkConditionRefs(
          rule.condition,
          `sections[${section.id}].onExit.rules[${i}].condition`
        );
      }
      if (section.onExit.default && !sectionIds.has(section.onExit.default)) {
        errors.push(
          `sections[${section.id}].onExit.default: references unknown section "${section.onExit.default}"`
        );
      }
    }

    for (const question of section.questions) {
      if (question.showIf) {
        checkConditionRefs(
          question.showIf,
          `sections[${section.id}].questions[${question.id}].showIf`
        );
      }

      // Validate select-type questions have options
      const selectTypes = ["single_select", "multi_select", "dropdown", "ranking"];
      if (selectTypes.includes(question.type) && (!question.options || question.options.length === 0)) {
        errors.push(
          `questions[${question.id}]: type "${question.type}" requires options`
        );
      }

      // Validate config type matches question type (if config has a type field)
      if (question.config && typeof question.config === "object" && "type" in question.config) {
        const configType = (question.config as { type: string }).type;
        if (configType !== question.type) {
          errors.push(
            `questions[${question.id}]: config.type "${configType}" does not match question type "${question.type}"`
          );
        }
      }
    }
  }

  return errors;
}

// ---- Public API ----

/**
 * Validates a raw schema object against the FormEngine schema definition.
 * Throws FormEngineSchemaError if validation fails.
 * Returns the validated and typed schema on success.
 */
export function validateSchema(schema: unknown): FormEngineSchema {
  // Step 1: Structural validation with Zod
  const result = formEngineSchemaZod.safeParse(schema);
  if (!result.success) {
    throw new FormEngineSchemaError(result.error.issues);
  }

  const parsed = result.data as FormEngineSchema;

  // Step 2: Cross-reference validation
  const crossErrors = validateCrossReferences(parsed);
  if (crossErrors.length > 0) {
    throw new FormEngineSchemaError(
      crossErrors.map((message) => ({
        code: "custom" as const,
        path: [],
        message,
      }))
    );
  }

  return parsed;
}
