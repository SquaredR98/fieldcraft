import type { FormState } from "../types/state";
import type { FormEngineSchema, Question } from "../types/schema";
import { evaluate } from "./condition-evaluator";
import { validateField } from "./validation-runner";
import { evaluateExpression, extractFieldRefs } from "./calculated-resolver";
import { createNavigation } from "./navigation";
import type { ValidatorRegistry } from "../validators/registry";
import type { CalculatedConfig, ScoringConfig } from "../types/question-types";

export type StateManagerConfig = {
  schema: FormEngineSchema;
  initialValues: Record<string, unknown>;
  validatorRegistry?: ValidatorRegistry;
  onStateChange?: (state: FormState) => void;
  onSectionChange?: (sectionId: string, index: number) => void;
  onFieldChange?: (fieldId: string, value: unknown) => void;
};

/**
 * Creates the internal state manager.
 * Manages form values, validation, visibility, navigation, and scores.
 * Uses a pub/sub pattern to notify listeners of state changes.
 */
export function createStateManager(config: StateManagerConfig) {
  const { schema, validatorRegistry } = config;
  const navigation = createNavigation(schema);

  // Build lookup maps for fast access
  const questionMap = new Map<string, Question>();
  const questionSectionMap = new Map<string, string>(); // questionId → sectionId
  for (const section of schema.sections) {
    for (const question of section.questions) {
      questionMap.set(question.id, question);
      questionSectionMap.set(question.id, section.id);
    }
  }

  // Build dependency graph: fieldId → set of fieldIds that depend on it
  const dependencyGraph = buildDependencyGraph(schema);

  // Subscribers
  const listeners = new Set<(state: FormState) => void>();

  // Initialize state
  const initialSectionId = navigation.getInitialSectionId(config.initialValues);
  const isConversational = schema.settings?.displayMode === "conversational";
  const initialQuestionId = isConversational
    ? navigation.getInitialQuestionId(config.initialValues)
    : "";
  navigation.markVisited(initialSectionId);

  let state: FormState = {
    values: { ...config.initialValues },
    errors: {},
    warnings: {},
    touched: {},
    isDirty: false,

    isSubmitting: false,
    isSubmitted: false,
    submitError: undefined,
    submitAttempted: false,

    currentSectionId: initialSectionId,
    currentSectionIndex: 0,
    totalVisibleSections: 0,
    progressPercent: 0,
    visibleSectionIds: [],
    visitedSectionIds: [initialSectionId],

    canGoNext: false,
    canGoPrev: false,
    isCurrentSectionValid: true,

    // Question-level navigation
    currentQuestionId: initialQuestionId,
    currentQuestionIndex: 0,
    totalVisibleQuestions: 0,
    questionProgressPercent: 0,
    canGoNextQuestion: false,
    canGoPrevQuestion: false,

    scores: {},
    totalScore: undefined,

    hasDraft: false,
    lastDraftSavedAt: undefined,

    focusTimestamps: {},
  };

  // Compute initial derived state
  recomputeDerivedState();

  // ---- Public methods ----

  function getState(): FormState {
    return state;
  }

  function subscribe(listener: (state: FormState) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function setValue(fieldId: string, value: unknown): void {
    const prevValue = state.values[fieldId];
    if (prevValue === value) return;

    state = {
      ...state,
      values: { ...state.values, [fieldId]: value },
      touched: { ...state.touched, [fieldId]: true },
      isDirty: true,
    };

    config.onFieldChange?.(fieldId, value);

    // Re-validate this field
    const field = questionMap.get(fieldId);
    if (field) {
      const fieldErrors = validateField(field, value, state.values, validatorRegistry);
      state = {
        ...state,
        errors: { ...state.errors, [fieldId]: fieldErrors },
      };
    }

    // Recompute calculated fields that depend on this field
    recomputeCalculatedFields(fieldId);

    // Recompute scores
    recomputeScores();

    // Recompute derived state (visibility, navigation, etc.)
    recomputeDerivedState();

    notify();
  }

  function setValues(values: Record<string, unknown>): void {
    state = {
      ...state,
      values: { ...state.values, ...values },
      isDirty: true,
    };
    recomputeAllCalculatedFields();
    recomputeScores();
    recomputeDerivedState();
    notify();
  }

  function touchField(fieldId: string): void {
    if (state.touched[fieldId]) return;
    state = {
      ...state,
      touched: { ...state.touched, [fieldId]: true },
    };

    // Run validation on touch (blur)
    const field = questionMap.get(fieldId);
    if (field) {
      const fieldErrors = validateField(
        field,
        state.values[fieldId],
        state.values,
        validatorRegistry,
      );
      state = {
        ...state,
        errors: { ...state.errors, [fieldId]: fieldErrors },
      };
    }

    notify();
  }

  function clearField(fieldId: string): void {
    const newValues = { ...state.values };
    delete newValues[fieldId];
    const newErrors = { ...state.errors };
    delete newErrors[fieldId];
    const newTouched = { ...state.touched };
    delete newTouched[fieldId];

    state = {
      ...state,
      values: newValues,
      errors: newErrors,
      touched: newTouched,
      isDirty: true,
    };

    recomputeCalculatedFields(fieldId);
    recomputeScores();
    recomputeDerivedState();
    notify();
  }

  function nextSection(): boolean {
    const navState = navigation.computeState(state.currentSectionId, state.values);
    if (!navState.canGoNext) return false;

    // Validate all visible fields in the current section before allowing navigation
    const currentSection = schema.sections.find((s) => s.id === state.currentSectionId);
    if (currentSection) {
      const sectionErrors: Record<string, string[]> = {};
      const sectionTouched: Record<string, boolean> = {};
      for (const question of currentSection.questions) {
        if (question.showIf && !evaluate(question.showIf, state.values)) continue;
        if (isStructuralField(question.type)) continue;
        const errors = validateField(question, state.values[question.id], state.values, validatorRegistry);
        if (errors.length > 0) {
          sectionErrors[question.id] = errors;
        }
        sectionTouched[question.id] = true;
      }
      if (Object.keys(sectionErrors).length > 0) {
        // Block navigation — show errors on all fields in section
        state = {
          ...state,
          errors: { ...state.errors, ...sectionErrors },
          touched: { ...state.touched, ...sectionTouched },
          isCurrentSectionValid: false,
        };
        notify();
        return false;
      }
    }

    const nextId = navigation.resolveNextSectionId(state.currentSectionId, state.values);
    if (!nextId) return false;

    navigation.markVisited(nextId);
    const newNavState = navigation.computeState(nextId, state.values);

    state = {
      ...state,
      currentSectionId: newNavState.currentSectionId,
      currentSectionIndex: newNavState.currentSectionIndex,
      visitedSectionIds: newNavState.visitedSectionIds,
      canGoNext: newNavState.canGoNext,
      canGoPrev: newNavState.canGoPrev,
      progressPercent: newNavState.progressPercent,
    };

    config.onSectionChange?.(state.currentSectionId, state.currentSectionIndex);
    notify();
    return true;
  }

  function prevSection(): boolean {
    const prevId = navigation.resolvePrevSectionId(state.currentSectionId, state.values);
    if (!prevId) return false;

    const newNavState = navigation.computeState(prevId, state.values);

    state = {
      ...state,
      currentSectionId: newNavState.currentSectionId,
      currentSectionIndex: newNavState.currentSectionIndex,
      visitedSectionIds: newNavState.visitedSectionIds,
      canGoNext: newNavState.canGoNext,
      canGoPrev: newNavState.canGoPrev,
      progressPercent: newNavState.progressPercent,
    };

    config.onSectionChange?.(state.currentSectionId, state.currentSectionIndex);
    notify();
    return true;
  }

  function jumpTo(sectionId: string): boolean {
    const visibleIds = navigation.getVisibleSectionIds(state.values);
    if (!visibleIds.includes(sectionId)) return false;

    navigation.markVisited(sectionId);
    const newNavState = navigation.computeState(sectionId, state.values);

    state = {
      ...state,
      currentSectionId: newNavState.currentSectionId,
      currentSectionIndex: newNavState.currentSectionIndex,
      visitedSectionIds: newNavState.visitedSectionIds,
      canGoNext: newNavState.canGoNext,
      canGoPrev: newNavState.canGoPrev,
      progressPercent: newNavState.progressPercent,
    };

    config.onSectionChange?.(state.currentSectionId, state.currentSectionIndex);
    notify();
    return true;
  }

  // ── Question-level navigation ──

  function nextQuestion(): boolean {
    const next = navigation.resolveNextQuestionId(state.currentQuestionId, state.values);
    if (!next) return false;

    // Validate the current question before advancing
    const currentQ = questionMap.get(state.currentQuestionId);
    if (currentQ && !isStructuralField(currentQ.type)) {
      const errors = validateField(
        currentQ,
        state.values[currentQ.id],
        state.values,
        validatorRegistry,
      );
      if (errors.length > 0) {
        state = {
          ...state,
          errors: { ...state.errors, [currentQ.id]: errors },
          touched: { ...state.touched, [currentQ.id]: true },
        };
        notify();
        return false;
      }
    }

    // Move to the next question
    state = { ...state, currentQuestionId: next.question.id };

    // If the next question is in a different section, navigate the section too
    if (next.sectionId !== state.currentSectionId) {
      navigation.markVisited(next.sectionId);
      const navState = navigation.computeState(next.sectionId, state.values);
      state = {
        ...state,
        currentSectionId: navState.currentSectionId,
        currentSectionIndex: navState.currentSectionIndex,
        visitedSectionIds: navState.visitedSectionIds,
        canGoNext: navState.canGoNext,
        canGoPrev: navState.canGoPrev,
        progressPercent: navState.progressPercent,
      };
      config.onSectionChange?.(state.currentSectionId, state.currentSectionIndex);
    }

    recomputeDerivedState();
    notify();
    return true;
  }

  function prevQuestion(): boolean {
    const prev = navigation.resolvePrevQuestionId(state.currentQuestionId, state.values);
    if (!prev) return false;

    state = { ...state, currentQuestionId: prev.question.id };

    // If the prev question is in a different section, navigate the section too
    if (prev.sectionId !== state.currentSectionId) {
      const navState = navigation.computeState(prev.sectionId, state.values);
      state = {
        ...state,
        currentSectionId: navState.currentSectionId,
        currentSectionIndex: navState.currentSectionIndex,
        visitedSectionIds: navState.visitedSectionIds,
        canGoNext: navState.canGoNext,
        canGoPrev: navState.canGoPrev,
        progressPercent: navState.progressPercent,
      };
      config.onSectionChange?.(state.currentSectionId, state.currentSectionIndex);
    }

    recomputeDerivedState();
    notify();
    return true;
  }

  function setSubmitting(submitting: boolean): void {
    state = { ...state, isSubmitting: submitting };
    notify();
  }

  function setSubmitted(submitted: boolean, error?: string): void {
    state = {
      ...state,
      isSubmitted: submitted,
      isSubmitting: false,
      submitError: error,
    };
    notify();
  }

  function setSubmitAttempted(): void {
    state = { ...state, submitAttempted: true };

    // Re-validate all visible fields now that submit was attempted
    revalidateAllVisibleFields();

    notify();
  }

  function setDraftState(hasDraft: boolean, savedAt?: string): void {
    state = {
      ...state,
      hasDraft,
      lastDraftSavedAt: savedAt,
    };
    notify();
  }

  function restoreFromDraft(
    values: Record<string, unknown>,
    currentSectionId: string,
    visitedSectionIds: string[],
  ): void {
    // Restore values first so visibility can be evaluated
    state = {
      ...state,
      values: { ...values },
      isDirty: false,
    };

    // Filter visited sections to only those currently visible
    const visibleIds = navigation.getVisibleSectionIds(state.values);
    const validVisitedIds = visitedSectionIds.filter(id => visibleIds.includes(id));
    navigation.restoreVisited(validVisitedIds);
    const effectiveSectionId = visibleIds.includes(currentSectionId)
      ? currentSectionId
      : (visibleIds[0] ?? schema.sections[0]?.id ?? "");

    const navState = navigation.computeState(effectiveSectionId, state.values);
    state = {
      ...state,
      currentSectionId: navState.currentSectionId,
      currentSectionIndex: navState.currentSectionIndex,
      visibleSectionIds: navState.visibleSectionIds,
      visitedSectionIds: navState.visitedSectionIds,
      canGoNext: navState.canGoNext,
      canGoPrev: navState.canGoPrev,
      totalVisibleSections: navState.totalVisibleSections,
      progressPercent: navState.progressPercent,
    };

    recomputeAllCalculatedFields();
    recomputeScores();
    notify();
  }

  // ---- Internal helpers ----

  function notify(): void {
    // Create a new state reference so useSyncExternalStore detects the change
    state = { ...state };
    for (const listener of listeners) {
      try {
        listener(state);
      } catch (error) {
        console.error("[FieldCraft] Subscriber error:", error);
      }
    }
    try {
      config.onStateChange?.(state);
    } catch (error) {
      console.error("[FieldCraft] onStateChange error:", error);
    }
  }

  function recomputeDerivedState(): void {
    const navState = navigation.computeState(state.currentSectionId, state.values);

    // Check if current section is valid
    const currentSection = schema.sections.find((s) => s.id === navState.currentSectionId);
    let isCurrentSectionValid = true;
    if (currentSection) {
      for (const question of currentSection.questions) {
        if (question.showIf && !evaluate(question.showIf, state.values)) continue;
        if (isStructuralField(question.type)) continue;
        const errors = validateField(
          question,
          state.values[question.id],
          state.values,
          validatorRegistry,
        );
        if (errors.length > 0) {
          isCurrentSectionValid = false;
          break;
        }
      }
    }

    state = {
      ...state,
      currentSectionId: navState.currentSectionId,
      currentSectionIndex: navState.currentSectionIndex,
      visibleSectionIds: navState.visibleSectionIds,
      visitedSectionIds: navState.visitedSectionIds,
      canGoNext: navState.canGoNext,
      canGoPrev: navState.canGoPrev,
      totalVisibleSections: navState.totalVisibleSections,
      progressPercent: navState.progressPercent,
      isCurrentSectionValid,
    };

    // Compute question-level navigation state only in conversational mode
    // to avoid expensive iteration on every keystroke in stepped/classic modes
    if (schema.settings?.displayMode === "conversational") {
      const questionNav = navigation.computeQuestionState(
        state.currentQuestionId,
        state.values,
      );
      state = {
        ...state,
        currentQuestionId: questionNav.currentQuestionId,
        currentQuestionIndex: questionNav.currentQuestionIndex,
        totalVisibleQuestions: questionNav.totalVisibleQuestions,
        questionProgressPercent: questionNav.questionProgressPercent,
        canGoNextQuestion: questionNav.canGoNextQuestion,
        canGoPrevQuestion: questionNav.canGoPrevQuestion,
      };
    }
  }

  function recomputeCalculatedFields(changedFieldId: string): void {
    const dependents = dependencyGraph.get(changedFieldId);
    if (!dependents) return;

    for (const depId of dependents) {
      const question = questionMap.get(depId);
      if (!question || question.type !== "calculated") continue;
      const calcConfig = question.config as CalculatedConfig | undefined;
      if (!calcConfig?.expression) continue;

      const { value, warning } = evaluateExpression(calcConfig.expression, state.values);
      const newWarnings = { ...state.warnings };
      if (warning) {
        newWarnings[depId] = warning;
      } else {
        delete newWarnings[depId];
      }
      state = {
        ...state,
        values: { ...state.values, ...(value !== null ? { [depId]: value } : {}) },
        warnings: newWarnings,
      };
    }
  }

  function recomputeAllCalculatedFields(): void {
    for (const [id, question] of questionMap) {
      if (question.type !== "calculated") continue;
      const calcConfig = question.config as CalculatedConfig | undefined;
      if (!calcConfig?.expression) continue;

      const { value, warning } = evaluateExpression(calcConfig.expression, state.values);
      const newWarnings = { ...state.warnings };
      if (warning) {
        newWarnings[id] = warning;
      } else {
        delete newWarnings[id];
      }
      state = {
        ...state,
        values: { ...state.values, ...(value !== null ? { [id]: value } : {}) },
        warnings: newWarnings,
      };
    }
  }

  function recomputeScores(): void {
    const scores: Record<string, number> = {};
    let totalScore = 0;
    let hasScoring = false;

    for (const [id, question] of questionMap) {
      if (question.type !== "scoring") continue;
      const scoringConfig = question.config as ScoringConfig | undefined;
      if (!scoringConfig?.options) continue;

      hasScoring = true;
      const selectedValue = state.values[id];
      const selectedOption = scoringConfig.options.find((opt) => opt.value === selectedValue);
      if (selectedOption) {
        scores[id] = selectedOption.score;
        totalScore += selectedOption.score;
      }
    }

    state = {
      ...state,
      scores,
      totalScore: hasScoring ? totalScore : undefined,
    };
  }

  function resetField(fieldId: string): void {
    const initialValue = config.initialValues[fieldId];
    const newValues = { ...state.values };
    if (initialValue !== undefined) {
      newValues[fieldId] = initialValue;
    } else {
      delete newValues[fieldId];
    }
    const newErrors = { ...state.errors };
    delete newErrors[fieldId];
    const newTouched = { ...state.touched };
    delete newTouched[fieldId];
    const newWarnings = { ...state.warnings };
    delete newWarnings[fieldId];

    state = {
      ...state,
      values: newValues,
      errors: newErrors,
      touched: newTouched,
      warnings: newWarnings,
    };

    recomputeCalculatedFields(fieldId);
    recomputeScores();
    recomputeDerivedState();
    notify();
  }

  function resetForm(): void {
    state = {
      ...state,
      values: { ...config.initialValues },
      errors: {},
      warnings: {},
      touched: {},
      isDirty: false,
      isSubmitted: false,
      isSubmitting: false,
      submitError: undefined,
      submitAttempted: false,
    };

    recomputeAllCalculatedFields();
    recomputeScores();
    recomputeDerivedState();
    notify();
  }

  function getFieldState(fieldId: string) {
    const question = questionMap.get(fieldId);
    return {
      value: state.values[fieldId],
      error: state.errors[fieldId] ?? [],
      touched: state.touched[fieldId] ?? false,
      visible: question?.showIf ? evaluate(question.showIf, state.values) : true,
      disabled: question?.disabled
        ? typeof question.disabled === "boolean"
          ? question.disabled
          : evaluate(question.disabled, state.values)
        : false,
      readonly: question?.readonly
        ? typeof question.readonly === "boolean"
          ? question.readonly
          : evaluate(question.readonly, state.values)
        : false,
      required: question?.required
        ? typeof question.required === "boolean"
          ? question.required
          : evaluate(question.required, state.values)
        : false,
      warning: state.warnings[fieldId],
    };
  }

  function getChangedFields(): Record<string, unknown> {
    const changed: Record<string, unknown> = {};
    for (const [id, value] of Object.entries(state.values)) {
      if (value !== config.initialValues[id]) {
        changed[id] = value;
      }
    }
    // Check for fields that were in initial but removed
    for (const id of Object.keys(config.initialValues)) {
      if (!(id in state.values)) {
        changed[id] = undefined;
      }
    }
    return changed;
  }

  function focusField(fieldId: string): void {
    state = {
      ...state,
      focusTimestamps: {
        ...state.focusTimestamps,
        [fieldId]: Date.now(),
      },
    };
  }

  function revalidateAllVisibleFields(): void {
    const newErrors: Record<string, string[]> = {};
    for (const section of schema.sections) {
      if (section.showIf && !evaluate(section.showIf, state.values)) continue;
      for (const question of section.questions) {
        if (question.showIf && !evaluate(question.showIf, state.values)) continue;
        if (isStructuralField(question.type)) continue;
        const errors = validateField(
          question,
          state.values[question.id],
          state.values,
          validatorRegistry,
        );
        if (errors.length > 0) {
          newErrors[question.id] = errors;
        }
      }
    }
    state = { ...state, errors: newErrors };
  }

  return {
    getState,
    subscribe,
    setValue,
    setValues,
    touchField,
    clearField,
    nextSection,
    prevSection,
    jumpTo,
    nextQuestion,
    prevQuestion,
    setSubmitting,
    setSubmitted,
    setSubmitAttempted,
    setDraftState,
    restoreFromDraft,
    resetField,
    resetForm,
    getFieldState,
    getChangedFields,
    focusField,
    notify,
    navigation,
  };
}

// ---- Helpers ----

function isStructuralField(type: string): boolean {
  return [
    "section_header",
    "info_block",
    "page_break",
    "welcome-screen",
    "thank-you-screen",
    "rich-text",
    "image",
    "video",
    "divider",
    "spacer",
  ].includes(type);
}

/**
 * Build a dependency graph: fieldId → Set of fieldIds that depend on it.
 * Used for efficient recalculation of calculated fields.
 */
function buildDependencyGraph(schema: FormEngineSchema): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();

  for (const section of schema.sections) {
    for (const question of section.questions) {
      if (question.type === "calculated" && question.config) {
        const calcConfig = question.config as CalculatedConfig;
        if (calcConfig.expression) {
          const refs = extractFieldRefs(calcConfig.expression);
          for (const ref of refs) {
            if (!graph.has(ref)) {
              graph.set(ref, new Set());
            }
            graph.get(ref)!.add(question.id);
          }
        }
      }
    }
  }

  return graph;
}
