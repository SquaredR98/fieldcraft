import { useMemo } from "react";
import type { FormEngine } from "@squaredr/fieldcraft-core";

export type FieldOption = {
  value: string;
  label: string;
};

/**
 * Returns the options for a select/dropdown/radio field.
 *
 * Reads the field's `options` array from the schema and returns
 * a stable reference as long as the field ID doesn't change.
 *
 * @param engine - The `FormEngine` instance.
 * @param fieldId - The field ID to get options for.
 * @returns An array of `{ value, label }` objects, or an empty array if no options.
 */
export function useFieldOptions(engine: FormEngine, fieldId: string): FieldOption[] {
  return useMemo(() => {
    const question = engine.getQuestionById(fieldId);
    if (!question) return [];
    const opts = (question as Record<string, unknown>).options;
    if (!Array.isArray(opts)) return [];
    return opts.map((opt: unknown) => {
      if (typeof opt === "string") return { value: opt, label: opt };
      const o = opt as Record<string, unknown>;
      return {
        value: String(o.value ?? ""),
        label: String(o.label ?? o.value ?? ""),
      };
    });
  }, [engine, fieldId]);
}
