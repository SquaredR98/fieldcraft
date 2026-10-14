import type { CalculatedConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, groupAria } from "./FieldWrapper";

export function CalculatedField({ field, value, error, touched, disabled: _disabled, readonly: _readonly, onChange: _onChange, onBlur: _onBlur, onFocus: _onFocus }: FieldProps) {
  const hasError = !!(touched && error?.length);
  const config = field.config as CalculatedConfig | undefined;
  if (config?.visible === false) return null;

  const formatted = formatValue(value, config);

  return (
    <FieldWrapper field={field} error={error} touched={touched} composite>
      <div className="rounded-md bg-muted/50 px-4 py-2" aria-live="polite" role="group" {...groupAria(field, hasError)}>
        <span className="text-lg font-semibold text-foreground">
          {config?.prefix}{formatted}{config?.suffix}
        </span>
      </div>
    </FieldWrapper>
  );
}

function formatValue(val: unknown, config?: CalculatedConfig): string {
  if (val == null) return "\u2014";
  if (typeof val === "string") return val;
  if (typeof val === "number") {
    const decimals = config?.decimalPlaces ?? 2;
    if (config?.format === "percentage") return `${val.toFixed(decimals)}%`;
    if (config?.format === "currency") return val.toFixed(decimals);
    return val.toFixed(decimals);
  }
  return String(val);
}
