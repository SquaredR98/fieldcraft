import { useSyncExternalStore, useCallback } from "react";
import type { FormEngine } from "@squaredr/fieldcraft-core";

/**
 * Subscribes to the validation errors for a single field.
 *
 * Returns `undefined` when the field has no errors (or hasn't been validated yet),
 * and a `string[]` of error messages when validation fails.
 *
 * @param engine - The `FormEngine` instance (typically from {@link useFormEngine}).
 * @param fieldId - The `id` of the field whose errors to observe.
 * @returns An array of error message strings, or `undefined` if there are no errors.
 *
 * @example
 * ```tsx
 * const errors = useFieldError(engine, "email");
 * // errors → undefined | ["Email is required", "Must be a valid email"]
 * ```
 */
export function useFieldError(
  engine: FormEngine,
  fieldId: string,
): string[] | undefined {
  return useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => engine.subscribe(onStoreChange),
      [engine],
    ),
    useCallback(() => {
      const errors = engine.getState().errors[fieldId];
      return errors && errors.length > 0 ? errors : undefined;
    }, [engine, fieldId]),
    useCallback(() => {
      const errors = engine.getState().errors[fieldId];
      return errors && errors.length > 0 ? errors : undefined;
    }, [engine, fieldId]),
  );
}
