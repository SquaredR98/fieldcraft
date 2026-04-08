import type { OpinionScaleConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "../../utils/cn";

export function OpinionScaleField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as OpinionScaleConfig | undefined;
  const min = config?.min ?? 1;
  const max = config?.max ?? 5;
  const current = value as number | undefined;

  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={field.label}>
        <div className="flex gap-0.5">
          {steps.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={current === n}
              className={cn(
                "flex-1 h-10 rounded-md border border-input text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                current === n
                  ? "fe-option-filled"
                  : "bg-transparent text-foreground hover:bg-accent",
              )}
              disabled={disabled}
              onClick={() => { onChange(n); onBlur(); }}
            >
              {n}
            </button>
          ))}
        </div>
        {(config?.minLabel || config?.maxLabel) && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{config?.minLabel ?? ""}</span>
            <span>{config?.maxLabel ?? ""}</span>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
