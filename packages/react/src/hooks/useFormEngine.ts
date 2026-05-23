import { useRef, useSyncExternalStore, useCallback, useEffect, useMemo } from "react";
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

  // Proxy methods through engineRef so callers never hold a stale reference
  // to a destroyed engine. This prevents "FormEngine has been destroyed"
  // errors caused by React Strict Mode double-mounting in development.
  const proxy = useMemo<FormEngine>(() => {
    function current(): FormEngine {
      if (!engineRef.current) throw new Error("FormEngine is not available");
      return engineRef.current;
    }
    return {
      getState: () => current().getState(),
      subscribe: (listener) => current().subscribe(listener),
      nextSection: () => current().nextSection(),
      prevSection: () => current().prevSection(),
      jumpTo: (id) => current().jumpTo(id),
      setValue: (id, val) => current().setValue(id, val),
      setValues: (vals) => current().setValues(vals),
      touchField: (id) => current().touchField(id),
      clearField: (id) => current().clearField(id),
      getVisibleSections: () => current().getVisibleSections(),
      getVisibleFields: (id) => current().getVisibleFields(id),
      isFieldRequired: (id) => current().isFieldRequired(id),
      isFieldVisible: (id) => current().isFieldVisible(id),
      isFieldDisabled: (id) => current().isFieldDisabled(id),
      getFieldError: (id) => current().getFieldError(id),
      saveDraft: () => current().saveDraft(),
      loadDraft: () => current().loadDraft(),
      clearDraft: () => current().clearDraft(),
      validate: () => current().validate(),
      validateSection: (id) => current().validateSection(id),
      submit: () => current().submit(),
      getSchema: () => current().getSchema(),
      getSectionById: (id) => current().getSectionById(id),
      getQuestionById: (id) => current().getQuestionById(id),
      destroy: () => current().destroy(),
    };
  }, []);

  return {
    ...proxy,
    state,
  };
}
