import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Input } from "../ui/input";

export function PhoneField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const hasError = !!(touched && error?.length);

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <Input
        {...fieldAria(field, hasError)}
        type="tel"
        value={(value as string) ?? ""}
        placeholder={field.placeholder ?? "(555) 123-4567"}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete="tel"
      />
    </FieldWrapper>
  );
}
