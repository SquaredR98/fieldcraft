import { useSyncExternalStore, useCallback } from "react";
import type { FormEngine } from "@squaredr/fieldcraft-core";

export type UseFormSubmitReturn = {
  submit: () => Promise<{ success: boolean }>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
};

/**
 * Provides a submit function and submission state.
 *
 * @param engine - The `FormEngine` instance.
 * @returns `{ submit, isSubmitting, isSubmitted, error }`.
 */
export function useFormSubmit(engine: FormEngine): UseFormSubmitReturn {
  const subscribe = useCallback(
    (onStoreChange: () => void) => engine.subscribe(onStoreChange),
    [engine],
  );

  const isSubmitting = useSyncExternalStore(
    subscribe,
    useCallback(() => engine.getState().isSubmitting, [engine]),
    useCallback(() => engine.getState().isSubmitting, [engine]),
  );

  const isSubmitted = useSyncExternalStore(
    subscribe,
    useCallback(() => engine.getState().isSubmitted, [engine]),
    useCallback(() => engine.getState().isSubmitted, [engine]),
  );

  const error = useSyncExternalStore(
    subscribe,
    useCallback(() => engine.getState().submitError ?? null, [engine]),
    useCallback(() => engine.getState().submitError ?? null, [engine]),
  );

  const submit = useCallback(
    () => engine.submit(),
    [engine],
  );

  return { submit, isSubmitting, isSubmitted, error };
}
