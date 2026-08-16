import { useSyncExternalStore, useCallback, useRef } from "react";
import type { FormEngine } from "@squaredr/fieldcraft-core";

/**
 * Subscribes to the visibility state of all fields in the form.
 *
 * @param engine - The `FormEngine` instance.
 * @returns A `Record<string, boolean>` mapping field IDs to their visibility.
 */
export function useConditionalFields(engine: FormEngine): Record<string, boolean> {
  const prevRef = useRef<Record<string, boolean>>({});

  const getSnapshot = useCallback((): Record<string, boolean> => {
    const schema = engine.getSchema();
    const map: Record<string, boolean> = {};
    for (const section of schema.sections) {
      for (const q of section.questions) {
        map[q.id] = engine.isFieldVisible(q.id);
      }
    }
    // Referential stability: only return a new object if values changed
    const prev = prevRef.current;
    const keys = Object.keys(map);
    if (
      keys.length === Object.keys(prev).length &&
      keys.every((k) => prev[k] === map[k])
    ) {
      return prev;
    }
    prevRef.current = map;
    return map;
  }, [engine]);

  return useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => engine.subscribe(onStoreChange),
      [engine],
    ),
    getSnapshot,
    getSnapshot,
  );
}
