import type { FormEngineSchema, Section } from "../types/schema";
import { evaluate } from "./condition-evaluator";

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
    const visitedCount = visitedSectionIds.filter((id) => visibleIds.includes(id)).length;
    const progressPercent = total > 0 ? Math.round((visitedCount / total) * 100) : 0;

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

  return {
    getVisibleSectionIds,
    getVisibleSections,
    computeState,
    resolveNextSectionId,
    resolvePrevSectionId,
    markVisited,
    restoreVisited,
    getInitialSectionId,
  };
}
