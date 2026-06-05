import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Common countries — the full list would be loaded asynchronously in production
const COMMON_COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "CH", name: "Switzerland" },
  { code: "NZ", name: "New Zealand" },
  { code: "SG", name: "Singapore" },
];

export function CountrySelectField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const hasError = !!(touched && error?.length);
  const options = field.options;
  const aria = fieldAria(field, hasError);

  const countries = options
    ? options.map((o) => ({ code: String(o.value), name: o.label }))
    : COMMON_COUNTRIES;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <Select
        value={(value as string) || undefined}
        onValueChange={(val) => onChange(val)}
        disabled={disabled}
      >
        <SelectTrigger
          id={aria.id}
          aria-describedby={aria["aria-describedby"]}
          aria-invalid={aria["aria-invalid"]}
          aria-required={aria["aria-required"]}
          className="w-full"
          onBlur={onBlur}
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
