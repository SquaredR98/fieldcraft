import type { CalculatedConfig } from "@squaredr/formengine-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";

export function CalculatedField({ field, value, error, touched }: FieldProps) {
  const config = field.config as CalculatedConfig | undefined;
  if (config?.visible === false) return null;

  const formatted = formatValue(value as number | null, config);

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="rounded-md bg-muted/50 px-4 py-2" aria-live="polite">
        <span className="text-lg font-semibold text-foreground">
          {config?.prefix}{formatted}{config?.suffix}
        </span>
      </div>
    </FieldWrapper>
  );
}

function formatValue(val: number | null | undefined, config?: CalculatedConfig): string {
  if (val == null) return "\u2014";
  const decimals = config?.decimalPlaces ?? 2;
  if (config?.format === "percentage") return `${val.toFixed(decimals)}%`;
  if (config?.format === "currency") return val.toFixed(decimals);
  return val.toFixed(decimals);
}
