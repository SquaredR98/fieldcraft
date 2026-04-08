import { useSyncExternalStore, useCallback } from "react";
import type { FormEngine } from "@squaredr/fieldcraft-core";

export type SectionProgress = {
  currentSectionId: string;
  currentSectionIndex: number;
  totalVisibleSections: number;
  progressPercent: number;
  visitedSectionIds: string[];
  canGoNext: boolean;
  canGoPrev: boolean;
};

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
