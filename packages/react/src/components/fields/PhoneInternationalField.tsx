import type { PhoneInternationalConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const COUNTRY_CODES = [
  { code: "US", dial: "+1", label: "+1 (US)" },
  { code: "GB", dial: "+44", label: "+44 (UK)" },
  { code: "CA", dial: "+1", label: "+1 (CA)" },
  { code: "AU", dial: "+61", label: "+61 (AU)" },
  { code: "DE", dial: "+49", label: "+49 (DE)" },
  { code: "FR", dial: "+33", label: "+33 (FR)" },
  { code: "IN", dial: "+91", label: "+91 (IN)" },
  { code: "JP", dial: "+81", label: "+81 (JP)" },
];

export function PhoneInternationalField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as PhoneInternationalConfig | undefined;
  const hasError = !!(touched && error?.length);
  const phoneValue = (value as { countryCode?: string; number?: string }) ?? {};

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex gap-2">
        <Select
          value={phoneValue.countryCode ?? config?.defaultCountry ?? "US"}
          onValueChange={(val) =>
            onChange({ ...phoneValue, countryCode: val })
          }
          disabled={disabled}
        >
          <SelectTrigger className="w-32 shrink-0" aria-label="Country code">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_CODES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          {...fieldAria(field, hasError)}
          type="tel"
          value={phoneValue.number ?? ""}
          placeholder={field.placeholder}
          disabled={disabled}
          onChange={(e) =>
            onChange({ ...phoneValue, number: e.target.value })
          }
          onBlur={onBlur}
        />
      </div>
    </FieldWrapper>
  );
}
