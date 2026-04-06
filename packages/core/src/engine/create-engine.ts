import type { FormEngineSchema, Section, Question } from "../types/schema";
import type { FormState } from "../types/state";
import type { FormResponse, SubmitResult } from "../types/response";
import type { SubmitAdapter, DraftAdapter, AnalyticsAdapter } from "../types/adapters";
import type { CustomValidator, AsyncValidator } from "../types/validation";
import type { ConditionExpression } from "../types/conditions";
import { validateSchema } from "../schema/schema-validator";
import { createStateManager } from "./state-manager";
import { createValidatorRegistry } from "../validators/registry";
import { evaluate } from "./condition-evaluator";
import { validateSection as runValidateSection, validateAll } from "./validation-runner";
import { resolvePrefill } from "./prefill-resolver";
import { createDraftManager } from "./draft-manager";
import { runSubmission } from "./submission-pipeline";
import { generateSessionToken } from "../utils/session-token";

export type EngineOptions = {
  mode?: "controlled" | "uncontrolled";
  initialValues?: Record<string, unknown>;
  prefillValues?: Record<string, unknown>;
  adapters?: SubmitAdapter | SubmitAdapter[];
  draftAdapter?: DraftAdapter;
  analytics?: AnalyticsAdapter;
  onSubmit?: (response: FormResponse) => void | Promise<void>;
  onStateChange?: (state: FormState) => void;
  onSectionChange?: (sectionId: string, index: number) => void;
  onFieldChange?: (fieldId: string, value: unknown) => void;
  validators?: Record<string, CustomValidator>;
  asyncValidators?: Record<string, AsyncValidator>;
  sessionToken?: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string[]>;
  firstErrorFieldId?: string;
  firstErrorSectionId?: string;
};

export type FormEngine = {
  getState(): FormState;
  subscribe(listener: (state: FormState) => void): () => void;

  nextSection(): void;
  prevSection(): void;
  jumpTo(sectionId: string): void;

  setValue(fieldId: string, value: unknown): void;
  setValues(values: Record<string, unknown>): void;
  touchField(fieldId: string): void;
  clearField(fieldId: string): void;

  getVisibleSections(): Section[];
  getVisibleFields(sectionId: string): Question[];
  isFieldRequired(fieldId: string): boolean;
  isFieldVisible(fieldId: string): boolean;
  isFieldDisabled(fieldId: string): boolean;
  getFieldError(fieldId: string): string[] | undefined;

  saveDraft(): Promise<void>;
  loadDraft(): Promise<boolean>;
  clearDraft(): void;

  validate(): ValidationResult;
  validateSection(sectionId: string): ValidationResult;
  submit(): Promise<SubmitResult>;

  setExternalValues?(values: Record<string, unknown>): void;

  getSchema(): FormEngineSchema;
  getSectionById(sectionId: string): Section | undefined;
  getQuestionById(questionId: string): Question | undefined;

  destroy(): void;
};

export function createEngine(
  rawSchema: FormEngineSchema,
  options?: EngineOptions,
): FormEngine {
  // Validate schema at creation time
  const schema = validateSchema(rawSchema);

  // Build lookup maps
  const sectionMap = new Map<string, Section>();
  const questionMap = new Map<string, Question>();
  const questionSectionMap = new Map<string, string>();

  for (const section of schema.sections) {
    sectionMap.set(section.id, section);
    for (const question of section.questions) {
      questionMap.set(question.id, question);
      questionSectionMap.set(question.id, section.id);
    }
  }

  // Create validator registry
  const validatorRegistry = createValidatorRegistry(
    options?.validators,
    options?.asyncValidators,
  );

  // Resolve prefill values
  const prefilled = resolvePrefill(
    schema,
    options?.prefillValues,
    schema.settings?.prefill,
  );
  const initialValues = { ...prefilled, ...(options?.initialValues ?? {}) };

  // Session token
  const sessionToken = options?.sessionToken ?? generateSessionToken();

  // Track form start time
  const startedAt = Date.now();

  // Create state manager
  const stateManager = createStateManager({
    schema,
    initialValues,
    validatorRegistry,
    onStateChange: options?.onStateChange,
    onSectionChange: options?.onSectionChange,
    onFieldChange: options?.onFieldChange,
  });

  // Create draft manager
  const draftManager = createDraftManager({
    schemaId: schema.id,
    sessionToken,
    storage: schema.settings?.draftStorage ?? "local",
    ttlHours: schema.settings?.draftTtlHours ?? 72,
    draftAdapter: options?.draftAdapter,
  });

  // Normalize adapters to array
  const adapters: SubmitAdapter[] = options?.adapters
    ? Array.isArray(options.adapters) ? options.adapters : [options.adapters]
    : [];

  // Check for existing draft
  if (schema.settings?.allowDraftSave !== false && draftManager.hasDraft()) {
    stateManager.setDraftState(true);
  }

  // Cleanup tracking
  let destroyed = false;

  function assertNotDestroyed(): void {
    if (destroyed) throw new Error("FormEngine has been destroyed");
  }

  // ---- Build the engine object ----

  const engine: FormEngine = {
    getState() {
      return stateManager.getState();
    },

    subscribe(listener) {
      return stateManager.subscribe(listener);
    },

    nextSection() {
      stateManager.nextSection();
    },

    prevSection() {
      stateManager.prevSection();
    },

    jumpTo(sectionId) {
      stateManager.jumpTo(sectionId);
    },

    setValue(fieldId, value) {
      assertNotDestroyed();
      stateManager.setValue(fieldId, value);
    },

    setValues(values) {
      stateManager.setValues(values);
    },

    touchField(fieldId) {
      stateManager.touchField(fieldId);
    },

    clearField(fieldId) {
      stateManager.clearField(fieldId);
    },

    getVisibleSections() {
      const state = stateManager.getState();
      return schema.sections.filter(
        (s) => !s.showIf || evaluate(s.showIf, state.values),
      );
    },

    getVisibleFields(sectionId) {
      const section = sectionMap.get(sectionId);
      if (!section) return [];
      const state = stateManager.getState();
      return section.questions.filter(
        (q) => !q.showIf || evaluate(q.showIf, state.values),
      );
    },

    isFieldRequired(fieldId) {
      const question = questionMap.get(fieldId);
      if (!question) return false;
      if (typeof question.required === "boolean") return question.required;
      if (question.required) {
        const state = stateManager.getState();
        return evaluate(question.required as ConditionExpression, state.values);
      }
      return false;
    },

    isFieldVisible(fieldId) {
      const question = questionMap.get(fieldId);
      if (!question) return false;
      if (!question.showIf) return true;
      const state = stateManager.getState();
      return evaluate(question.showIf, state.values);
    },

    isFieldDisabled(fieldId) {
      const question = questionMap.get(fieldId);
      if (!question) return false;
      if (typeof question.disabled === "boolean") return question.disabled;
      if (question.disabled) {
        const state = stateManager.getState();
        return evaluate(question.disabled as ConditionExpression, state.values);
      }
      return false;
    },

    getFieldError(fieldId) {
      const state = stateManager.getState();
      const errors = state.errors[fieldId];
      return errors && errors.length > 0 ? errors : undefined;
    },

    async saveDraft() {
      const state = stateManager.getState();
      await draftManager.save({
        values: state.values,
        currentSectionId: state.currentSectionId,
        visitedSectionIds: state.visitedSectionIds,
        savedAt: new Date().toISOString(),
      });
      stateManager.setDraftState(true, new Date().toISOString());
    },

    async loadDraft() {
      const snapshot = await draftManager.load();
      if (!snapshot) return false;
      stateManager.restoreFromDraft(
        snapshot.values,
        snapshot.currentSectionId,
        snapshot.visitedSectionIds,
      );
      stateManager.setDraftState(true, snapshot.savedAt);
      return true;
    },

    clearDraft() {
      draftManager.clear();
      stateManager.setDraftState(false);
    },

    validate() {
      const state = stateManager.getState();
      return validateAll(schema, state.values, validatorRegistry);
    },

    validateSection(sectionId) {
      const section = sectionMap.get(sectionId);
      if (!section) {
        return { valid: true, errors: {} };
      }
      const state = stateManager.getState();
      return runValidateSection(section, state.values, validatorRegistry);
    },

    async submit() {
      assertNotDestroyed();
      stateManager.setSubmitAttempted();

      // Validate all
      const validation = engine.validate();
      if (!validation.valid) {
        return {
          success: false,
          adapterResults: [{
            adapterName: "validation",
            success: false,
            error: `Validation failed: ${Object.keys(validation.errors).length} field(s) with errors`,
          }],
        };
      }

      stateManager.setSubmitting(true);

      const state = stateManager.getState();

      // Build response
      const response: FormResponse = {
        schemaId: schema.id,
        schemaVersion: schema.version,
        submittedAt: new Date().toISOString(),
        sessionToken,
        values: state.values,
        scores: Object.keys(state.scores).length > 0 ? state.scores : undefined,
        totalScore: state.totalScore,
        completionTimeMs: Date.now() - startedAt,
      };

      // Run submission pipeline
      const result = await runSubmission(response, adapters, options?.onSubmit);

      if (result.success) {
        stateManager.setSubmitted(true);
        // Clear draft on successful submission
        draftManager.clear();
        stateManager.setDraftState(false);
      } else {
        const failedAdapters = result.adapterResults
          .filter((r) => !r.success)
          .map((r) => r.error)
          .join("; ");
        stateManager.setSubmitted(false, failedAdapters);
      }

      return result;
    },

    getSchema() {
      return schema;
    },

    getSectionById(sectionId) {
      return sectionMap.get(sectionId);
    },

    getQuestionById(questionId) {
      return questionMap.get(questionId);
    },

    destroy() {
      destroyed = true;
      // Allow GC
    },
  };

  return engine;
}
