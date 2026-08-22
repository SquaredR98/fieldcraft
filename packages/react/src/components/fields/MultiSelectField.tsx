import { useState } from "react";
import type { MultiSelectConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "../../utils/cn";

const LAYOUT_CLASSES: Record<string, string> = {
  vertical: "flex flex-col gap-2",
  horizontal: "flex flex-wrap gap-2",
  grid: "grid grid-cols-2 gap-2",
};

export function MultiSelectField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as MultiSelectConfig | undefined;
  const options = field.options ?? [];
  const selected = (value as (string | number | boolean)[]) ?? [];
  const maxSelections = config?.maxSelections;
  const layout = config?.layout ?? "vertical";
  const allowOther = config?.allowOther === true;
  const otherLabel = config?.otherLabel ?? "Other";

  const optionValues = new Set(options.map((o) => String(o.value)));
  const otherValues = selected.filter((v) => !optionValues.has(String(v)));
  const hasOtherSelected = otherValues.length > 0;
  const [otherText, setOtherText] = useState(hasOtherSelected ? String(otherValues[0]) : "");

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

  const toggleOther = () => {
    if (hasOtherSelected) {
      onChange(selected.filter((v) => optionValues.has(String(v))));
    } else {
      const text = otherText || "";
      if (maxSelections && selected.length >= maxSelections) return;
      onChange([...selected, text]);
    }
    onBlur();
  };

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className={LAYOUT_CLASSES[layout] ?? LAYOUT_CLASSES.vertical} role="group" aria-label={field.label} onFocus={onFocus}>
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
                disabled={disabled || readonly}
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
        {allowOther && (
          <Label
            htmlFor={`${field.id}-other`}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors font-normal",
              hasOtherSelected
                ? "fc-option-active"
                : "border-input hover:bg-accent",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <Checkbox
              id={`${field.id}-other`}
              checked={hasOtherSelected}
              disabled={disabled || readonly}
              onCheckedChange={toggleOther}
            />
            <span className="text-sm font-medium">{otherLabel}</span>
            {hasOtherSelected && (
              <Input
                type="text"
                value={otherText}
                placeholder="Please specify..."
                className="ml-2 h-7 text-sm flex-1"
                disabled={disabled || readonly}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  setOtherText(e.target.value);
                  const withoutOld = selected.filter((v) => optionValues.has(String(v)));
                  onChange([...withoutOld, e.target.value]);
                }}
                onBlur={onBlur}
                autoFocus
              />
            )}
          </Label>
        )}
      </div>
    </FieldWrapper>
  );
}
