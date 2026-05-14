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

  // Create engine lazily. Re-creates if previous instance was destroyed
  // (handles React Strict Mode double-mount in development).
  if (engineRef.current === null) {
    engineRef.current = createEngine(schema, options);
  }

  const engine = engineRef.current;

  const subscribe = useCallback(
    (onStoreChange: () => void) => engine.subscribe(onStoreChange),
    [engine],
  );

  const getSnapshot = useCallback(() => engine.getState(), [engine]);

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Cleanup on unmount — destroy engine so it can be re-created
  // if the component remounts (React Strict Mode).
  useEffect(() => {
    const currentEngine = engineRef.current;
    return () => {
      currentEngine?.destroy();
      engineRef.current = null;
    };
  }, [engine]);

  // Return merged object — engine methods + reactive state
  return {
    ...engine,
    state,
  };
}
