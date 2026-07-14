import { useSyncExternalStore, useCallback } from "react";
import type { FormEngine } from "@squaredr/fieldcraft-core";

/** Snapshot of the form's multi-section navigation state. */
export type SectionProgress = {
  currentSectionId: string;
  currentSectionIndex: number;
  totalVisibleSections: number;
  progressPercent: number;
  visitedSectionIds: string[];
  canGoNext: boolean;
  canGoPrev: boolean;
};

/**
 * Subscribes to multi-section navigation and progress state.
 *
 * Provides the current section index, total visible sections, percentage
 * completion, visited section history, and navigation availability flags
 * (`canGoNext` / `canGoPrev`).
 *
 * @param engine - The `FormEngine` instance (typically from {@link useFormEngine}).
 * @returns A {@link SectionProgress} object that updates reactively.
 *
 * @example
 * ```tsx
 * const { progressPercent, currentSectionIndex, totalVisibleSections } =
 *   useSectionProgress(engine);
 *
 * return <span>Step {currentSectionIndex + 1} of {totalVisibleSections}</span>;
 * ```
 */
export function useSectionProgress(engine: FormEngine): SectionProgress {
  return useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => engine.subscribe(onStoreChange),
      [engine],
    ),
    useCallback(() => {
      const s = engine.getState();
      return {
        currentSectionId: s.currentSectionId,
        currentSectionIndex: s.currentSectionIndex,
        totalVisibleSections: s.totalVisibleSections,
        progressPercent: s.progressPercent,
        visitedSectionIds: s.visitedSectionIds,
        canGoNext: s.canGoNext,
        canGoPrev: s.canGoPrev,
      };
    }, [engine]),
    useCallback(() => {
      const s = engine.getState();
      return {
        currentSectionId: s.currentSectionId,
        currentSectionIndex: s.currentSectionIndex,
        totalVisibleSections: s.totalVisibleSections,
        progressPercent: s.progressPercent,
        visitedSectionIds: s.visitedSectionIds,
        canGoNext: s.canGoNext,
        canGoPrev: s.canGoPrev,
      };
    }, [engine]),
  );
}
