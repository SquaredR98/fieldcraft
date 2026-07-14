import { useSyncExternalStore, useCallback } from "react";
import type { FormEngine } from "@squaredr/fieldcraft-core";

/**
 * Subscribes to a single field's current value inside the engine state.
 *
 * Re-renders the consuming component only when the value for `fieldId` changes,
 * using `useSyncExternalStore` for tear-free reads.
 *
 * @param engine - The `FormEngine` instance (typically from {@link useFormEngine}).
 * @param fieldId - The `id` of the field whose value to observe.
 * @returns The current value of the field, or `undefined` if not yet set.
 *
 * @example
 * ```tsx
 * const email = useFieldValue(engine, "email") as string;
 * ```
 */
export function useFieldValue(engine: FormEngine, fieldId: string): unknown {
  return useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => engine.subscribe(onStoreChange),
      [engine],
    ),
    useCallback(() => engine.getState().values[fieldId], [engine, fieldId]),
    useCallback(() => engine.getState().values[fieldId], [engine, fieldId]),
  );
}
