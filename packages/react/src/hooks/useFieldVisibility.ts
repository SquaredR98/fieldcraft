import { useSyncExternalStore, useCallback } from "react";
import type { FormEngine } from "@squaredr/fieldcraft-core";

/**
 * Subscribes to a field's visibility state.
 *
 * @param engine - The `FormEngine` instance.
 * @param fieldId - The field ID to observe.
 * @returns `true` if the field is currently visible.
 */
export function useFieldVisibility(engine: FormEngine, fieldId: string): boolean {
  return useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => engine.subscribe(onStoreChange),
      [engine],
    ),
    useCallback(() => engine.isFieldVisible(fieldId), [engine, fieldId]),
    useCallback(() => engine.isFieldVisible(fieldId), [engine, fieldId]),
  );
}
