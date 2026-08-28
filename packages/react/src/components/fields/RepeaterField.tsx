import { useEffect, useRef } from "react";
import type { RepeaterConfig, Question } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Button } from "../ui/button";
import { FieldRenderer } from "../FieldRenderer";
import { useFieldRegistry } from "../../registry/FieldRegistryContext";
import { useTheme } from "../../theme/ThemeProvider";

type RepeaterEntry = Record<string, unknown>;

export function RepeaterField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as RepeaterConfig | undefined;
  const entries = (value as RepeaterEntry[]) ?? [];
  const subFields = (config?.fields ?? []) as Question[];
  const registry = useFieldRegistry();
  const theme = useTheme();
  const minEntries = config?.minEntries ?? 0;
  const maxEntries = config?.maxEntries ?? Infinity;

  // Seed default entries on first render when value is empty
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const defaultEntries = config?.defaultEntries ?? 0;
    if (entries.length === 0 && defaultEntries > 0) {
      const count = Math.min(defaultEntries, maxEntries);
      onChange(Array.from({ length: count }, () => ({})));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addEntry = () => {
    if (entries.length >= maxEntries) return;
    onChange([...entries, {}]);
  };

  const removeEntry = (index: number) => {
    if (entries.length <= minEntries) return;
    onChange(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, fieldId: string, val: unknown) => {
    const next = entries.map((entry, i) =>
      i === index ? { ...entry, [fieldId]: val } : entry,
    );
    onChange(next);
    onBlur();
  };

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-3">
        {entries.map((entry, index) => (
          <div key={index} className="rounded-lg border border-input bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
              {entries.length > minEntries && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => removeEntry(index)}
                  disabled={disabled || readonly}
                  aria-label={config?.removeLabel ?? `Remove entry ${index + 1}`}
                >
                  {config?.removeLabel ?? "Remove"}
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {subFields.map((subField) => (
                <FieldRenderer
                  key={subField.id}
                  field={subField}
                  value={entry[subField.id] ?? undefined}
                  error={undefined}
                  touched={touched}
                  disabled={disabled}
                  readonly={readonly}
                  onChange={(val) => updateEntry(index, subField.id, val)}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  theme={theme}
                  registry={registry}
                />
              ))}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addEntry}
          disabled={disabled || readonly || entries.length >= maxEntries}
        >
          {config?.addLabel ?? "+ Add entry"}
        </Button>
      </div>
    </FieldWrapper>
  );
}
