import { useRef, useSyncExternalStore, useMemo } from "react";
import {
  createEngine,
  type FormEngine,
  type EngineOptions,
  type FormEngineSchema,
  type FormState,
} from "@squaredr/fieldcraft-core";

export type UseFormEngineReturn = FormEngine & { state: FormState };

/**
 * React hook that creates and manages a FormEngine instance.
 *
 * Uses a single stable engine (never destroyed) to avoid stale-subscription
 * bugs with React Strict Mode's double mount/unmount cycle.
 * useSyncExternalStore drives re-renders when engine state changes.
 */
export function useFormEngine(
  schema: FormEngineSchema,
  options?: EngineOptions,
): UseFormEngineReturn {
  // Create engine once and keep it for the lifetime of the hook.
  // We intentionally do NOT destroy it on unmount — React Strict Mode
  // would destroy it between the first unmount and second mount, leaving
  // useSyncExternalStore subscribed to a dead engine.
  const engineRef = useRef<FormEngine | null>(null);
  if (engineRef.current === null) {
    engineRef.current = createEngine(schema, options);
  }
  const engine = engineRef.current;

  // Stable subscribe/getSnapshot that always reference the same engine.
  const subscribe = useMemo(
    () => (onStoreChange: () => void) => engine.subscribe(onStoreChange),
    [engine],
  );
  const getSnapshot = useMemo(() => () => engine.getState(), [engine]);

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Stable proxy so callers always get the same object identity
  const proxy = useMemo<FormEngine>(
    () => ({
      getState: () => engine.getState(),
      subscribe: (listener) => engine.subscribe(listener),
      nextSection: () => engine.nextSection(),
      prevSection: () => engine.prevSection(),
      jumpTo: (id) => engine.jumpTo(id),
      setValue: (id, val) => engine.setValue(id, val),
      setValues: (vals) => engine.setValues(vals),
      touchField: (id) => engine.touchField(id),
      clearField: (id) => engine.clearField(id),
      getVisibleSections: () => engine.getVisibleSections(),
      getVisibleFields: (id) => engine.getVisibleFields(id),
      isFieldRequired: (id) => engine.isFieldRequired(id),
      isFieldVisible: (id) => engine.isFieldVisible(id),
      isFieldDisabled: (id) => engine.isFieldDisabled(id),
      getFieldError: (id) => engine.getFieldError(id),
      saveDraft: () => engine.saveDraft(),
      loadDraft: () => engine.loadDraft(),
      clearDraft: () => engine.clearDraft(),
      validate: () => engine.validate(),
      validateSection: (id) => engine.validateSection(id),
      submit: () => engine.submit(),
      updateFieldCustomProps: (id, props) => engine.updateFieldCustomProps(id, props),
      getSchema: () => engine.getSchema(),
      getSectionById: (id) => engine.getSectionById(id),
      getQuestionById: (id) => engine.getQuestionById(id),
      destroy: () => engine.destroy(),
    }),
    [engine],
  );

  return {
    ...proxy,
    state,
  };
}
