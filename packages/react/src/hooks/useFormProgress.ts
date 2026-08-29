import { useSyncExternalStore, useCallback, useRef } from "react";
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
  const cacheRef = useRef<FormProgress>({ current: 1, total: 0, percentage: 0 });

  const getSnapshot = useCallback((): FormProgress => {
    const state = engine.getState();
    const current = state.currentSectionIndex + 1;
    const total = state.totalVisibleSections;
    const percentage = state.progressPercent;
    const cached = cacheRef.current;

    if (
      cached.current === current &&
      cached.total === total &&
      cached.percentage === percentage
    ) {
      return cached;
    }

    cacheRef.current = { current, total, percentage };
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
