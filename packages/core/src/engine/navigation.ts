import type { FormEngineSchema, Question, Section } from "../types/schema";
import { evaluate } from "./condition-evaluator";

/** Structural field types that are not user-input questions. */
const STRUCTURAL_TYPES = new Set([
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
]);

export type NavigationState = {
  currentSectionId: string;
  currentSectionIndex: number;
  visibleSectionIds: string[];
  visitedSectionIds: string[];
  canGoNext: boolean;
  canGoPrev: boolean;
  totalVisibleSections: number;
  progressPercent: number;
};

/** A visible input question with its parent section context. */
export type VisibleQuestion = {
  question: Question;
  sectionId: string;
  globalIndex: number;
};

/**
 * Creates a navigation manager that handles section navigation and jump logic.
 */
export function createNavigation(schema: FormEngineSchema) {
  let visitedSectionIds: string[] = [];

  /**
   * Get all currently visible section IDs based on their showIf conditions.
   */
  function getVisibleSectionIds(values: Record<string, unknown>): string[] {
    return schema.sections
      .filter((section) => !section.showIf || evaluate(section.showIf, values))
      .map((section) => section.id);
  }

  /**
   * Get visible sections as full Section objects.
   */
  function getVisibleSections(values: Record<string, unknown>): Section[] {
    return schema.sections.filter(
      (section) => !section.showIf || evaluate(section.showIf, values),
    );
  }

  /**
   * Compute the full navigation state for a given section and values.
   */
  function computeState(
    currentSectionId: string,
    values: Record<string, unknown>,
  ): NavigationState {
    const visibleIds = getVisibleSectionIds(values);
    const currentIndex = visibleIds.indexOf(currentSectionId);

    // If current section is no longer visible, snap to first visible
    const effectiveIndex = currentIndex >= 0 ? currentIndex : 0;
    const effectiveId = visibleIds[effectiveIndex] ?? schema.sections[0]?.id ?? "";

    const total = visibleIds.length;
    // Progress is step-based: synced with the step counter (currentStep / totalSteps)
    const progressPercent = total > 0 ? Math.round(((effectiveIndex + 1) / total) * 100) : 0;

    return {
      currentSectionId: effectiveId,
      currentSectionIndex: effectiveIndex,
      visibleSectionIds: visibleIds,
      visitedSectionIds: [...visitedSectionIds],
      canGoNext: effectiveIndex < total - 1,
      canGoPrev: effectiveIndex > 0,
      totalVisibleSections: total,
      progressPercent: Math.min(progressPercent, 100),
    };
  }

  /**
   * Resolve the next section ID after the current section,
   * taking jump logic into account.
   */
  function resolveNextSectionId(
    currentSectionId: string,
    values: Record<string, unknown>,
  ): string | null {
    const currentSection = schema.sections.find((s) => s.id === currentSectionId);
    if (!currentSection) return null;

    // Check jump rules
    if (currentSection.onExit) {
      for (const rule of currentSection.onExit.rules) {
        if (evaluate(rule.condition, values)) {
          return rule.jumpTo;
        }
      }
      // Use default if no rule matched
      if (currentSection.onExit.default) {
        return currentSection.onExit.default;
      }
    }

    // No jump logic — go to next visible section
    const visibleIds = getVisibleSectionIds(values);
    const currentIndex = visibleIds.indexOf(currentSectionId);
    if (currentIndex >= 0 && currentIndex < visibleIds.length - 1) {
      return visibleIds[currentIndex + 1];
    }

    return null; // Already at last section
  }

  /**
   * Get the previous section ID (from visited history, not just sequential).
   */
  function resolvePrevSectionId(
    currentSectionId: string,
    values: Record<string, unknown>,
  ): string | null {
    // First try visited history (respects jump logic path)
    const visibleVisited = visitedSectionIds.filter((id) => {
      const visibleIds = getVisibleSectionIds(values);
      return visibleIds.includes(id);
    });

    const currentVisitedIndex = visibleVisited.lastIndexOf(currentSectionId);
    if (currentVisitedIndex > 0) {
      return visibleVisited[currentVisitedIndex - 1];
    }

    // Fallback: previous in visible order
    const visibleIds = getVisibleSectionIds(values);
    const currentIndex = visibleIds.indexOf(currentSectionId);
    if (currentIndex > 0) {
      return visibleIds[currentIndex - 1];
    }

    return null;
  }

  /**
   * Mark a section as visited.
   */
  function markVisited(sectionId: string): void {
    if (!visitedSectionIds.includes(sectionId)) {
      visitedSectionIds.push(sectionId);
    }
  }

  /**
   * Restore visited state (e.g., from a loaded draft).
   */
  function restoreVisited(ids: string[]): void {
    visitedSectionIds = [...ids];
  }

  /**
   * Get the initial section ID (first visible section).
   */
  function getInitialSectionId(values: Record<string, unknown>): string {
    const visibleIds = getVisibleSectionIds(values);
    return visibleIds[0] ?? schema.sections[0]?.id ?? "";
  }

  // ── Question-level navigation (for conversational mode) ──

  /**
   * Get all visible input questions across all visible sections,
   * in schema order, excluding structural fields and hidden questions.
   */
  function getVisibleQuestions(values: Record<string, unknown>): VisibleQuestion[] {
    const visibleSections = getVisibleSections(values);
    const result: VisibleQuestion[] = [];
    let globalIndex = 0;

    for (const section of visibleSections) {
      for (const question of section.questions) {
        if (STRUCTURAL_TYPES.has(question.type)) continue;
        if (question.showIf && !evaluate(question.showIf, values)) continue;
        result.push({ question, sectionId: section.id, globalIndex });
        globalIndex++;
      }
    }

    return result;
  }

  /**
   * Compute question-level navigation state.
   */
  function computeQuestionState(
    currentQuestionId: string,
    values: Record<string, unknown>,
  ) {
    const visibleQs = getVisibleQuestions(values);
    const total = visibleQs.length;

    if (total === 0) {
      return {
        currentQuestionId: "",
        currentQuestionIndex: 0,
        totalVisibleQuestions: 0,
        questionProgressPercent: 0,
        canGoNextQuestion: false,
        canGoPrevQuestion: false,
      };
    }

    const currentIdx = visibleQs.findIndex((vq) => vq.question.id === currentQuestionId);
    const effectiveIdx = currentIdx >= 0 ? currentIdx : 0;
    const effectiveId = visibleQs[effectiveIdx].question.id;

    const progressPercent = total > 0
      ? Math.round(((effectiveIdx + 1) / total) * 100)
      : 0;

    return {
      currentQuestionId: effectiveId,
      currentQuestionIndex: effectiveIdx,
      totalVisibleQuestions: total,
      questionProgressPercent: Math.min(progressPercent, 100),
      canGoNextQuestion: effectiveIdx < total - 1,
      canGoPrevQuestion: effectiveIdx > 0,
    };
  }

  /**
   * Resolve the next question ID after the current question.
   * Returns the next visible input question in schema order, or null if at the end.
   */
  function resolveNextQuestionId(
    currentQuestionId: string,
    values: Record<string, unknown>,
  ): VisibleQuestion | null {
    const visibleQs = getVisibleQuestions(values);
    const currentIdx = visibleQs.findIndex((vq) => vq.question.id === currentQuestionId);
    if (currentIdx >= 0 && currentIdx < visibleQs.length - 1) {
      return visibleQs[currentIdx + 1];
    }
    return null;
  }

  /**
   * Resolve the previous question ID before the current question.
   */
  function resolvePrevQuestionId(
    currentQuestionId: string,
    values: Record<string, unknown>,
  ): VisibleQuestion | null {
    const visibleQs = getVisibleQuestions(values);
    const currentIdx = visibleQs.findIndex((vq) => vq.question.id === currentQuestionId);
    if (currentIdx > 0) {
      return visibleQs[currentIdx - 1];
    }
    return null;
  }

  /**
   * Get the initial question ID (first visible input question).
   */
  function getInitialQuestionId(values: Record<string, unknown>): string {
    const visibleQs = getVisibleQuestions(values);
    return visibleQs[0]?.question.id ?? "";
  }

  return {
    getVisibleSectionIds,
    getVisibleSections,
    computeState,
    resolveNextSectionId,
    resolvePrevSectionId,
    markVisited,
    restoreVisited,
    getInitialSectionId,
    // Question-level navigation
    getVisibleQuestions,
    computeQuestionState,
    resolveNextQuestionId,
    resolvePrevQuestionId,
    getInitialQuestionId,
  };
}
