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
import { COUNTRIES } from "../../data/countries";

const COUNTRY_CODES = COUNTRIES.map((c) => ({
  code: c.code,
  dial: c.phone,
  label: `${c.phone} (${c.code})`,
}));

export function PhoneInternationalField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
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
          disabled={disabled || readonly}
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
          readOnly={readonly}
          onChange={(e) =>
            onChange({ ...phoneValue, number: e.target.value })
          }
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </div>
    </FieldWrapper>
  );
}
