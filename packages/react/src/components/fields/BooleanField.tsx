import type { BooleanConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { cn } from "../../utils/cn";

export function BooleanField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as BooleanConfig | undefined;
  const style = config?.style ?? "radio";
  const current = value as boolean | undefined;
  // Resolve labels: field.options takes precedence (backward compat), then config, then defaults
  const trueOpt = field.options?.find((o) => o.value === true);
  const falseOpt = field.options?.find((o) => o.value === false);
  const trueLabel = trueOpt?.label ?? config?.trueLabel ?? "Yes";
  const falseLabel = falseOpt?.label ?? config?.falseLabel ?? "No";

  if (style === "toggle") {
    return (
      <FieldWrapper field={field} error={error} touched={touched}>
        <div className="flex items-center gap-3">
          <Switch
            id={field.id}
            checked={current === true}
            onCheckedChange={(checked) => { onChange(checked); onBlur(); }}
            disabled={disabled || readonly}
            onFocus={onFocus}
          />
          <Label htmlFor={field.id} className="text-sm cursor-pointer">
            {current ? trueLabel : falseLabel}
          </Label>
        </div>
      </FieldWrapper>
    );
  }

  if (style === "checkbox") {
    return (
      <FieldWrapper field={field} error={error} touched={touched}>
        <div className="flex items-center gap-2">
          <Checkbox
            id={field.id}
            checked={current === true}
            onCheckedChange={(checked) => { onChange(checked === true); onBlur(); }}
            disabled={disabled || readonly}
            onFocus={onFocus}
          />
          <Label htmlFor={field.id} className="text-sm cursor-pointer">
            {trueLabel}
          </Label>
        </div>
      </FieldWrapper>
    );
  }

  // Default: radio-style button pair
  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex gap-2" role="radiogroup" aria-label={field.label} onFocus={onFocus}>
        <button
          type="button"
          role="radio"
          aria-checked={current === true}
          className={cn(
            "flex-1 h-10 rounded-md border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            current === true
              ? "fc-option-active"
              : "border-input bg-transparent text-foreground hover:bg-accent",
          )}
          disabled={disabled || readonly}
          onClick={() => { onChange(true); onBlur(); }}
        >
          {trueLabel}
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={current === false}
          className={cn(
            "flex-1 h-10 rounded-md border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            current === false
              ? "fc-option-active"
              : "border-input bg-transparent text-foreground hover:bg-accent",
          )}
          disabled={disabled || readonly}
          onClick={() => { onChange(false); onBlur(); }}
        >
          {falseLabel}
        </button>
      </div>
    </FieldWrapper>
  );
}
