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

/**
 * Configuration options for creating a form engine instance via {@link createEngine}.
 *
 * @example
 * ```typescript
 * const engine = createEngine(schema, {
 *   initialValues: { name: "Jane" },
 *   onSubmit: async (response) => {
 *     await fetch("/api/submit", { method: "POST", body: JSON.stringify(response) });
 *   },
 *   validators: {
 *     uniqueEmail: (value) => {
 *       // custom sync validation
 *       return undefined; // no error
 *     },
 *   },
 * });
 * ```
 *
 * @since 1.0.0
 */
export type EngineOptions = {
  /** Engine mode. `"uncontrolled"` (default) manages state internally. `"controlled"` expects external state management. */
  mode?: "controlled" | "uncontrolled";
  /** Pre-populated field values keyed by question ID. Merged on top of schema defaults and prefill. */
  initialValues?: Record<string, unknown>;
  /** Prefill values resolved from props, URL parameters, or both. See {@link PrefillConfig}. */
  prefillValues?: Record<string, unknown>;
  /** One or more submission adapters that persist the response on submit. */
  adapters?: SubmitAdapter | SubmitAdapter[];
  /** Optional draft adapter for server-side draft persistence. */
  draftAdapter?: DraftAdapter;
  /** Optional analytics adapter for tracking form interactions. */
  analytics?: AnalyticsAdapter;
  /** Callback invoked on successful submission. If provided, takes precedence over adapters. */
  onSubmit?: (response: FormResponse) => void | Promise<void>;
  /** Fires on every state change (value updates, navigation, validation). */
  onStateChange?: (state: FormState) => void;
  /** Fires when the active section changes. Receives the new section ID and its visible index. */
  onSectionChange?: (sectionId: string, index: number) => void;
  /** Fires when any field value changes. Receives the field ID and new value. */
  onFieldChange?: (fieldId: string, value: unknown) => void;
  /** Named custom validators referenced by `{ type: "custom", name: "..." }` validation rules. */
  validators?: Record<string, CustomValidator>;
  /** Named async validators referenced by `{ type: "async", endpoint: "..." }` validation rules. */
  asyncValidators?: Record<string, AsyncValidator>;
  /** Explicit session token for draft storage. Auto-generated if omitted. */
  sessionToken?: string;
};

/**
 * Result of a synchronous validation pass over one section or the entire form.
 *
 * @since 1.0.0
 */
export type ValidationResult = {
  /** `true` if zero errors were found. */
  valid: boolean;
  /** Map of field IDs to their error message arrays. Empty object when valid. */
  errors: Record<string, string[]>;
  /** ID of the first field with errors (useful for scrolling/focus). */
  firstErrorFieldId?: string;
  /** Section containing the first error field. */
  firstErrorSectionId?: string;
};

/**
 * The public API surface of a FieldCraft form engine instance.
 *
 * Created by {@link createEngine}. All methods are synchronous unless
 * noted otherwise. The engine follows a pub/sub pattern — call
 * {@link FormEngine.subscribe | subscribe} to react to state changes.
 *
 * @example
 * ```typescript
 * const engine = createEngine(schema);
 *
 * // Subscribe to state changes
 * const unsubscribe = engine.subscribe((state) => {
 *   console.log("Progress:", state.progressPercent + "%");
 * });
 *
 * // Set a value
 * engine.setValue("email", "user@example.com");
 *
 * // Navigate
 * engine.nextSection();
 *
 * // Submit
 * const result = await engine.submit();
 * ```
 *
 * @since 1.0.0
 */
export type FormEngine = {
  /** Returns the current immutable state snapshot. A new object reference is created on every change. */
  getState(): FormState;

  /**
   * Registers a listener that fires on every state change.
   * Compatible with React's `useSyncExternalStore`.
   *
   * @param listener - Callback receiving the new {@link FormState}.
   * @returns An unsubscribe function. Call it to stop receiving updates.
   */
  subscribe(listener: (state: FormState) => void): () => void;

  // ---- Navigation ----

  /** Advances to the next visible section. Respects jump rules defined in `section.onExit`. No-op if already on the last section. */
  nextSection(): void;
  /** Navigates to the previous section. Uses visited history to respect jump-logic paths. No-op if on the first section. */
  prevSection(): void;
  /**
   * Jumps directly to a section by ID. The section must be currently visible
   * (its `showIf` condition must evaluate to `true`). No-op for hidden sections.
   *
   * @param sectionId - The target section's `id`.
   */
  jumpTo(sectionId: string): void;

  // ---- Values ----

  /**
   * Sets a single field's value. Triggers validation, recalculates dependent
   * calculated fields, updates scores, and notifies all subscribers.
   *
   * @param fieldId - The question's `id`.
   * @param value - The new value.
   * @throws If the engine has been destroyed.
   */
  setValue(fieldId: string, value: unknown): void;
  /**
   * Batch-sets multiple field values in a single update. More efficient than
   * calling {@link FormEngine.setValue | setValue} in a loop — triggers only one recompute cycle.
   *
   * @param values - Map of field IDs to their new values.
   */
  setValues(values: Record<string, unknown>): void;
  /**
   * Marks a field as touched (e.g., on blur). Triggers validation for
   * that field so errors appear after the user interacts with it.
   *
   * @param fieldId - The question's `id`.
   */
  touchField(fieldId: string): void;
  /**
   * Removes a field's value, errors, and touched state. Useful when
   * dynamically hiding fields that should not retain stale data.
   *
   * @param fieldId - The question's `id`.
   */
  clearField(fieldId: string): void;

  // ---- Visibility & State Queries ----

  /** Returns all sections whose `showIf` condition evaluates to `true` (or have no condition). */
  getVisibleSections(): Section[];
  /**
   * Returns the visible questions within a specific section.
   * Questions with a `showIf` that evaluates to `false` are excluded.
   *
   * @param sectionId - The section's `id`.
   * @returns Array of visible {@link Question} objects. Empty array if section not found.
   */
  getVisibleFields(sectionId: string): Question[];
  /**
   * Checks whether a field is currently required. Evaluates conditional
   * `required` expressions against the current form values.
   *
   * @param fieldId - The question's `id`.
   * @returns `true` if the field is required, `false` if optional or not found.
   */
  isFieldRequired(fieldId: string): boolean;
  /**
   * Checks whether a field is currently visible based on its `showIf` condition.
   *
   * @param fieldId - The question's `id`.
   * @returns `true` if visible (or has no condition), `false` if hidden or not found.
   */
  isFieldVisible(fieldId: string): boolean;
  /**
   * Checks whether a field is currently disabled. Evaluates conditional
   * `disabled` expressions against the current form values.
   *
   * @param fieldId - The question's `id`.
   * @returns `true` if disabled, `false` if enabled or not found.
   */
  isFieldDisabled(fieldId: string): boolean;
  /**
   * Returns the current validation errors for a field.
   *
   * @param fieldId - The question's `id`.
   * @returns Array of error message strings, or `undefined` if no errors.
   */
  getFieldError(fieldId: string): string[] | undefined;

  // ---- Drafts ----

  /** Persists the current form state as a draft using localStorage and/or the configured {@link DraftAdapter}. */
  saveDraft(): Promise<void>;
  /**
   * Loads a previously saved draft and restores form values, section position, and visited history.
   *
   * @returns `true` if a draft was found and restored, `false` if no draft exists or it expired.
   */
  loadDraft(): Promise<boolean>;
  /** Deletes any saved draft from localStorage and the configured {@link DraftAdapter}. */
  clearDraft(): void;

  // ---- Validation & Submission ----

  /** Synchronously validates all visible fields across all visible sections. */
  validate(): ValidationResult;
  /**
   * Synchronously validates all visible fields within a single section.
   *
   * @param sectionId - The section's `id`.
   * @returns Validation result. Returns `{ valid: true }` if the section is not found.
   */
  validateSection(sectionId: string): ValidationResult;
  /**
   * Validates the entire form, then runs the submission pipeline.
   * Sends the response to the `onSubmit` callback or all registered adapters.
   * On success, clears any saved draft and marks the form as submitted.
   *
   * @returns The submission result with per-adapter outcomes.
   * @throws If the engine has been destroyed.
   */
  submit(): Promise<SubmitResult>;

  /**
   * Merges additional props into a field's `customProps` at runtime.
   * Useful for injecting data (e.g., a Stripe `clientSecret`) into a field
   * after engine creation without losing form state.
   *
   * @param fieldId - The question's `id`.
   * @param props - Key-value pairs to merge into the field's `customProps`.
   */
  updateFieldCustomProps(
    fieldId: string,
    props: Record<string, unknown>,
  ): void;

  // ---- Schema Lookups ----

  /** Returns the validated schema the engine was created with. */
  getSchema(): FormEngineSchema;
  /**
   * Finds a section by ID.
   *
   * @param sectionId - The section's `id`.
   * @returns The {@link Section} object, or `undefined` if not found.
   */
  getSectionById(sectionId: string): Section | undefined;
  /**
   * Finds a question by ID across all sections.
   *
   * @param questionId - The question's `id`.
   * @returns The {@link Question} object, or `undefined` if not found.
   */
  getQuestionById(questionId: string): Question | undefined;

  // ---- Lifecycle ----

  /**
   * Destroys the engine instance. After calling this, all mutating methods
   * (`setValue`, `submit`, etc.) will throw. Subscriptions stop firing.
   * Call this when unmounting your form component to allow garbage collection.
   */
  destroy(): void;
};

/**
 * Creates a new form engine instance from a schema definition.
 *
 * The engine validates the schema at creation time (throws {@link FormEngineSchemaError}
 * on invalid schemas), resolves prefill values, initializes navigation, and sets up
 * draft management. The returned {@link FormEngine} object is the primary API for
 * interacting with the form at runtime.
 *
 * @param rawSchema - A {@link FormEngineSchema} defining the form structure, fields, and behavior.
 * @param options - Optional {@link EngineOptions} for callbacks, adapters, initial values, and custom validators.
 * @returns A fully initialized {@link FormEngine} instance.
 *
 * @throws `FormEngineSchemaError` if the schema is invalid (missing required fields, structural violations, etc.).
 *
 * @example
 * ```typescript
 * import { createEngine } from "@squaredr/fieldcraft-core";
 *
 * const engine = createEngine(schema, {
 *   onSubmit: async (response) => {
 *     await saveToDatabase(response);
 *   },
 * });
 *
 * // Use with React via useSyncExternalStore
 * const state = useSyncExternalStore(engine.subscribe, engine.getState);
 * ```
 *
 * @since 1.0.0
 */
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

    updateFieldCustomProps(fieldId, props) {
      const question = questionMap.get(fieldId);
      if (!question) return;
      question.customProps = { ...question.customProps, ...props };
      // Notify subscribers so React re-renders with updated field data
      stateManager.notify();
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
