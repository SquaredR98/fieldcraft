import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";

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

  const countries = options
    ? options.map((o) => ({ code: String(o.value), name: o.label }))
    : COMMON_COUNTRIES;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <select
        {...fieldAria(field, hasError)}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
        value={(value as string) ?? ""}
        disabled={disabled}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? undefined : v);
        }}
        onBlur={onBlur}
      >
        <option value="">{field.placeholder ?? "Select country..."}</option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
