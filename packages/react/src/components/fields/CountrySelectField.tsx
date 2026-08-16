import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { COUNTRIES } from "../../data/countries";

export function CountrySelectField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const hasError = !!(touched && error?.length);
  const options = field.options;
  const aria = fieldAria(field, hasError);

  const countries = options
    ? options.map((o) => ({ code: String(o.value), name: o.label }))
    : COUNTRIES;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <Select
        value={(value as string) || undefined}
        onValueChange={(val) => onChange(val)}
        disabled={disabled || readonly}
      >
        <SelectTrigger
          id={aria.id}
          aria-describedby={aria["aria-describedby"]}
          aria-invalid={aria["aria-invalid"]}
          aria-required={aria["aria-required"]}
          className="w-full"
          onBlur={onBlur}
          onFocus={onFocus}
        >
          <SelectValue placeholder={field.placeholder ?? "Select country..."} />
        </SelectTrigger>
        <SelectContent>
          {countries.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}
