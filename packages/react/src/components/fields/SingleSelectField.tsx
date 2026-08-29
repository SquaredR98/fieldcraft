import { useState } from "react";
import type { SingleSelectConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "../../utils/cn";

const OTHER_VALUE = "__fc_other__";

const LAYOUT_CLASSES: Record<string, string> = {
  vertical: "flex flex-col gap-2",
  horizontal: "flex flex-wrap gap-2",
  grid: "grid grid-cols-2 gap-2",
};

export function SingleSelectField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as SingleSelectConfig | undefined;
  const options = field.options ?? [];
  const current = value !== undefined && value !== null && value !== "" ? String(value) : undefined;
  const hasError = touched && !!error?.length;
  const layout = config?.layout ?? "vertical";
  const allowOther = config?.allowOther === true;
  const otherLabel = config?.otherLabel ?? "Other";

  const isOtherSelected = allowOther && current != null && !options.some((opt) => String(opt.value) === current);
  const [otherText, setOtherText] = useState(isOtherSelected ? current : "");

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <RadioGroup
        value={isOtherSelected ? OTHER_VALUE : current}
        onValueChange={(val) => {
          if (val === OTHER_VALUE) {
            onChange(otherText || "");
          } else {
            onChange(val);
            onBlur();
          }
        }}
        disabled={disabled || readonly}
        className={LAYOUT_CLASSES[layout] ?? LAYOUT_CLASSES.vertical}
        aria-label={field.label}
        onFocus={onFocus}
        {...(hasError ? { "aria-invalid": true } : {})}
      >
        {options.map((opt) => {
          const optId = `${field.id}-${opt.value}`;
          const isSelected = current === String(opt.value);
          return (
            <Label
              key={String(opt.value)}
              htmlFor={optId}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors font-normal",
                isSelected
                  ? "fc-option-active"
                  : "border-input hover:bg-accent",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <RadioGroupItem value={String(opt.value)} id={optId} />
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
              isOtherSelected
                ? "fc-option-active"
                : "border-input hover:bg-accent",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <RadioGroupItem value={OTHER_VALUE} id={`${field.id}-other`} />
            <span className="text-sm font-medium">{otherLabel}</span>
            {isOtherSelected && (
              <Input
                type="text"
                value={otherText}
                placeholder="Please specify..."
                className="ml-2 h-7 text-sm flex-1"
                disabled={disabled || readonly}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  setOtherText(e.target.value);
                  onChange(e.target.value);
                }}
                onBlur={onBlur}
                autoFocus
              />
            )}
          </Label>
        )}
      </RadioGroup>
    </FieldWrapper>
  );
}
