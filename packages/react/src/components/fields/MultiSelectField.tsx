import type { MultiSelectConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { cn } from "../../utils/cn";

export function MultiSelectField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as MultiSelectConfig | undefined;
  const options = field.options ?? [];
  const selected = (value as (string | number | boolean)[]) ?? [];
  const maxSelections = config?.maxSelections;

  const toggle = (optValue: string | number | boolean, exclusive?: boolean) => {
    let next: (string | number | boolean)[];
    if (exclusive) {
      next = selected.includes(optValue) ? [] : [optValue];
    } else if (selected.includes(optValue)) {
      next = selected.filter((v) => v !== optValue);
    } else {
      const nonExclusive = selected.filter(
        (v) => !options.find((o) => o.value === v)?.exclusive,
      );
      if (maxSelections && nonExclusive.length >= maxSelections) return;
      next = [...nonExclusive, optValue];
    }
    onChange(next);
    onBlur();
  };

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-2" role="group" aria-label={field.label}>
        {options.map((opt) => {
          const checked = selected.includes(opt.value);
          const optId = `${field.id}-${opt.value}`;
          return (
            <Label
              key={String(opt.value)}
              htmlFor={optId}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors font-normal",
                checked
                  ? "fc-option-active"
                  : "border-input hover:bg-accent",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <Checkbox
                id={optId}
                checked={checked}
                disabled={disabled}
                onCheckedChange={() => toggle(opt.value, opt.exclusive)}
              />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  {opt.icon && <span>{opt.icon}</span>}
                  <span className="text-sm font-medium">{opt.label}</span>
                </div>
                {opt.helpText && (
                  <span className="text-xs text-muted-foreground">{opt.helpText}</span>
                )}
              </div>
            </Label>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
