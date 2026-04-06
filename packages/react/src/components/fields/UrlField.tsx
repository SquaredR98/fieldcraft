import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Input } from "../ui/input";

export function UrlField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const hasError = !!(touched && error?.length);

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <Input
        {...fieldAria(field, hasError)}
        type="url"
        value={(value as string) ?? ""}
        placeholder={field.placeholder ?? "https://"}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete="url"
      />
    </FieldWrapper>
  );
}
