import { useRef, useSyncExternalStore, useCallback, useEffect } from "react";
import {
  createEngine,
  type FormEngine,
  type EngineOptions,
  type FormEngineSchema,
  type FormState,
} from "@squaredr/fieldcraft-core";

export type UseFormEngineReturn = FormEngine & { state: FormState };

export function useFormEngine(
  schema: FormEngineSchema,
  options?: EngineOptions,
): UseFormEngineReturn {
  const engineRef = useRef<FormEngine | null>(null);

  // Create engine once (stable across renders)
  if (engineRef.current === null) {
    engineRef.current = createEngine(schema, options);
  }

  const engine = engineRef.current;

  const state = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => engine.subscribe(onStoreChange),
      [engine],
    ),
    useCallback(() => engine.getState(), [engine]),
    useCallback(() => engine.getState(), [engine]),
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  // Return merged object — engine methods + reactive state
  return {
    ...engine,
    state,
  };
}
