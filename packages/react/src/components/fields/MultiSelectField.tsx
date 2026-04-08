import type { MultiSelectConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
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
          return (
            <label
              key={String(opt.value)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors",
                checked
                  ? "fe-option-active"
                  : "border-input hover:bg-accent",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(opt.value, opt.exclusive)}
                className="sr-only"
              />
              <div className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                checked ? "border-primary bg-primary" : "border-input",
              )}>
                {checked && (
                  <svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth={2}>
                    <path d="M1.5 5L4 7.5L8.5 2.5" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  {opt.icon && <span>{opt.icon}</span>}
                  <span className="text-sm font-medium">{opt.label}</span>
                </div>
                {opt.helpText && (
                  <span className="text-xs text-muted-foreground">{opt.helpText}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
