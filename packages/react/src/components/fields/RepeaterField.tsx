import type { RepeaterConfig, Question } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

type RepeaterEntry = Record<string, unknown>;

export function RepeaterField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as RepeaterConfig | undefined;
  const entries = (value as RepeaterEntry[]) ?? [];
  const subFields = (config?.fields ?? []) as Question[];
  const minEntries = config?.minEntries ?? 0;
  const maxEntries = config?.maxEntries ?? Infinity;

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
                  disabled={disabled}
                  aria-label={config?.removeLabel ?? `Remove entry ${index + 1}`}
                >
                  {config?.removeLabel ?? "Remove"}
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {subFields.map((subField) => (
                <div key={subField.id} className="flex flex-col gap-1.5">
                  <Label className="text-xs">{subField.label}</Label>
                  <Input
                    type="text"
                    value={(entry[subField.id] as string) ?? ""}
                    disabled={disabled}
                    onChange={(e) => updateEntry(index, subField.id, e.target.value)}
                    placeholder={subField.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addEntry}
          disabled={disabled || entries.length >= maxEntries}
        >
          {config?.addLabel ?? "+ Add entry"}
        </Button>
      </div>
    </FieldWrapper>
  );
}
