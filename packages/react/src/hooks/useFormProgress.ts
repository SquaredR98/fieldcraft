import { useSyncExternalStore, useCallback } from "react";
import type { FormEngine } from "@squaredr/fieldcraft-core";

export type FormProgress = {
  current: number;
  total: number;
  percentage: number;
};

/**
 * Subscribes to the form's progress (current section, total sections, percentage).
 *
 * @param engine - The `FormEngine` instance.
 * @returns An object with `current` (1-based), `total`, and `percentage` (0-100).
 */
export function useFormProgress(engine: FormEngine): FormProgress {
  const getSnapshot = useCallback((): FormProgress => {
    const state = engine.getState();
    return {
      current: state.currentSectionIndex + 1,
      total: state.totalVisibleSections,
      percentage: state.progressPercent,
    };
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
