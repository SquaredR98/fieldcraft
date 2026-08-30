import type { OpinionScaleConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";

export function OpinionScaleField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as OpinionScaleConfig | undefined;
  const min = config?.min ?? 1;
  const max = config?.max ?? 5;
  const current = value as number | undefined;

  const step = config?.step && config.step > 0 ? config.step : 1;
  const steps: number[] = [];
  for (let n = min; n <= max; n += step) steps.push(n);

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={field.label} onFocus={onFocus}>
        <div className="flex gap-1">
          {steps.map((n) => {
            const isSelected = current === n;
            return (
              <Button
                key={n}
                type="button"
                role="radio"
                aria-checked={isSelected}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex-1 h-10 px-0 text-xs font-semibold",
                  isSelected && "shadow-sm ring-1 ring-primary",
                )}
                disabled={disabled || readonly}
                onClick={() => { onChange(n); onBlur(); }}
              >
                {n}
              </Button>
            );
          })}
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
