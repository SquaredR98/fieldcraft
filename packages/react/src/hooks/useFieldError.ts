import { useSyncExternalStore, useCallback } from "react";
import type { FormEngine } from "@squaredr/fieldcraft-core";

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
