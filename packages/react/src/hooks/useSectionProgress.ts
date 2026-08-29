import { useSyncExternalStore, useCallback, useRef } from "react";
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
  const cacheRef = useRef<SectionProgress>({
    currentSectionId: "",
    currentSectionIndex: 0,
    totalVisibleSections: 0,
    progressPercent: 0,
    visitedSectionIds: [],
    canGoNext: false,
    canGoPrev: false,
  });

  const getSnapshot = useCallback((): SectionProgress => {
    const s = engine.getState();
    const cached = cacheRef.current;

    const isVisitedEqual =
      cached.visitedSectionIds.length === s.visitedSectionIds.length &&
      cached.visitedSectionIds.every((id, idx) => id === s.visitedSectionIds[idx]);

    if (
      cached.currentSectionId === s.currentSectionId &&
      cached.currentSectionIndex === s.currentSectionIndex &&
      cached.totalVisibleSections === s.totalVisibleSections &&
      cached.progressPercent === s.progressPercent &&
      cached.canGoNext === s.canGoNext &&
      cached.canGoPrev === s.canGoPrev &&
      isVisitedEqual
    ) {
      return cached;
    }

    cacheRef.current = {
      currentSectionId: s.currentSectionId,
      currentSectionIndex: s.currentSectionIndex,
      totalVisibleSections: s.totalVisibleSections,
      progressPercent: s.progressPercent,
      visitedSectionIds: s.visitedSectionIds,
      canGoNext: s.canGoNext,
      canGoPrev: s.canGoPrev,
    };
    return cacheRef.current;
  }, [engine]);

  return useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => engine.subscribe(onStoreChange),
      [engine],
    ),
    getSnapshot,
    getSnapshot,
  );
}
