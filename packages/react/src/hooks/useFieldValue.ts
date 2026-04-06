import { useSyncExternalStore, useCallback } from "react";
import type { FormEngine } from "@squaredr/formengine-core";

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
