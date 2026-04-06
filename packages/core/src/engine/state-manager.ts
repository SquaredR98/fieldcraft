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
  navigation.markVisited(initialSectionId);

  let state: FormState = {
    values: { ...config.initialValues },
    errors: {},
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

    scores: {},
    totalScore: undefined,

    hasDraft: false,
    lastDraftSavedAt: undefined,
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
      const fieldErrors = validateField(field, state.values[fieldId], state.values, validatorRegistry);
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
      canGoNext: newNavState.canGoNext,
      canGoPrev: newNavState.canGoPrev,
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
    navigation.restoreVisited(visitedSectionIds);

    state = {
      ...state,
      values: { ...values },
      isDirty: false,
    };

    // Navigate to the restored section
    const visibleIds = navigation.getVisibleSectionIds(state.values);
    const effectiveSectionId = visibleIds.includes(currentSectionId)
      ? currentSectionId
      : visibleIds[0] ?? schema.sections[0]?.id ?? "";

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
    for (const listener of listeners) {
      listener(state);
    }
    config.onStateChange?.(state);
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
        const errors = validateField(question, state.values[question.id], state.values, validatorRegistry);
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
  }

  function recomputeCalculatedFields(changedFieldId: string): void {
    const dependents = dependencyGraph.get(changedFieldId);
    if (!dependents) return;

    for (const depId of dependents) {
      const question = questionMap.get(depId);
      if (!question || question.type !== "calculated") continue;
      const calcConfig = question.config as CalculatedConfig | undefined;
      if (!calcConfig?.expression) continue;

      const result = evaluateExpression(calcConfig.expression, state.values);
      if (result !== null) {
        state = {
          ...state,
          values: { ...state.values, [depId]: result },
        };
      }
    }
  }

  function recomputeAllCalculatedFields(): void {
    for (const [id, question] of questionMap) {
      if (question.type !== "calculated") continue;
      const calcConfig = question.config as CalculatedConfig | undefined;
      if (!calcConfig?.expression) continue;

      const result = evaluateExpression(calcConfig.expression, state.values);
      if (result !== null) {
        state = {
          ...state,
          values: { ...state.values, [id]: result },
        };
      }
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
      const selectedOption = scoringConfig.options.find(
        (opt) => opt.value === selectedValue,
      );
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

  function revalidateAllVisibleFields(): void {
    const newErrors: Record<string, string[]> = {};
    for (const section of schema.sections) {
      if (section.showIf && !evaluate(section.showIf, state.values)) continue;
      for (const question of section.questions) {
        if (question.showIf && !evaluate(question.showIf, state.values)) continue;
        if (isStructuralField(question.type)) continue;
        const errors = validateField(question, state.values[question.id], state.values, validatorRegistry);
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
    setSubmitting,
    setSubmitted,
    setSubmitAttempted,
    setDraftState,
    restoreFromDraft,
    navigation,
  };
}

// ---- Helpers ----

function isStructuralField(type: string): boolean {
  return ["section_header", "info_block", "page_break"].includes(type);
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
