import type { NpsConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, groupAria } from "./FieldWrapper";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";

export function NpsField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as NpsConfig | undefined;
  const hasError = !!(touched && error?.length);
  const current = value as number | undefined;

  return (
    <FieldWrapper field={field} error={error} touched={touched} composite>
      <div className="flex flex-col gap-2" role="radiogroup" {...groupAria(field, hasError)} onFocus={onFocus}>
        <div className="flex gap-1">
          {Array.from({ length: 11 }, (_, i) => {
            const isSelected = current === i;
            return (
              <Button
                key={i}
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
                onClick={() => { onChange(i); onBlur(); }}
              >
                {i}
              </Button>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{config?.lowLabel ?? "Not likely"}</span>
          <span>{config?.highLabel ?? "Very likely"}</span>
        </div>
      </div>
    </FieldWrapper>
  );
}
