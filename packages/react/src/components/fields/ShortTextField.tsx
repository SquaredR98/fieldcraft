import type { ShortTextConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Input } from "../ui/input";

export function ShortTextField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as ShortTextConfig | undefined;
  const hasError = !!(touched && error?.length);

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <Input
        {...fieldAria(field, hasError)}
        type="text"
        value={(value as string) ?? ""}
        placeholder={field.placeholder}
        maxLength={config?.maxLength}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
    </FieldWrapper>
  );
}
