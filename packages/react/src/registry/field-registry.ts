import type { Question, FormEngineTheme, QuestionType } from "@squaredr/formengine-core";

/** Props passed to every field component. */
export type FieldProps = {
  field: Question;
  value: unknown;
  error?: string[];
  touched: boolean;
  disabled: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  theme: FormEngineTheme;
};

/** A React component that renders a single field. */
export type FieldComponent = React.ComponentType<FieldProps>;

/** Maps QuestionType → FieldComponent. Partial because not all types need to be registered. */
export type FieldRegistry = Partial<Record<QuestionType, FieldComponent>>;

/** Create a mutable field registry. */
export function createFieldRegistry(
  initial?: FieldRegistry,
): FieldRegistry {
  return { ...initial };
}

/** Merge multiple registries. Later registries override earlier ones. */
export function mergeRegistries(
  ...registries: (FieldRegistry | undefined)[]
): FieldRegistry {
  const merged: FieldRegistry = {};
  for (const reg of registries) {
    if (reg) Object.assign(merged, reg);
  }
  return merged;
}
