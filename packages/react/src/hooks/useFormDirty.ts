import { useSyncExternalStore, useCallback } from "react";
import type { FormEngine } from "@squaredr/fieldcraft-core";

/**
 * Subscribes to the form's dirty state.
 *
 * @param engine - The `FormEngine` instance.
 * @returns `true` if any field value differs from its initial value.
 */
export function useFormDirty(engine: FormEngine): boolean {
  return useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => engine.subscribe(onStoreChange),
      [engine],
    ),
    useCallback(() => engine.getState().isDirty, [engine]),
    useCallback(() => engine.getState().isDirty, [engine]),
  );
}
