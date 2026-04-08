import type { DateConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Input } from "../ui/input";

export function DateField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as DateConfig | undefined;
  const hasError = !!(touched && error?.length);

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <Input
        {...fieldAria(field, hasError)}
        type="date"
        value={(value as string) ?? ""}
        min={config?.minDate}
        max={config?.maxDate}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value || undefined)}
        onBlur={onBlur}
      />
    </FieldWrapper>
  );
}
