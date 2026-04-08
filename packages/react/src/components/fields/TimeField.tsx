import type { TimeConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Input } from "../ui/input";

export function TimeField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as TimeConfig | undefined;
  const hasError = !!(touched && error?.length);
  const step = (config?.minuteStep ?? 1) * 60; // HTML time step is in seconds

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <Input
        {...fieldAria(field, hasError)}
        type="time"
        value={(value as string) ?? ""}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value || undefined)}
        onBlur={onBlur}
      />
    </FieldWrapper>
  );
}
