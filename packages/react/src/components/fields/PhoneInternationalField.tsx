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
import { COUNTRIES } from "@squaredr/fieldcraft-core";
import { useMemo } from "react";

const ALL_COUNTRY_CODES = COUNTRIES.map((c) => ({
  code: c.code,
  dial: c.phone,
  label: `${c.phone} (${c.code})`,
}));

export function PhoneInternationalField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as PhoneInternationalConfig | undefined;
  const hasError = !!(touched && error?.length);
  const phoneValue = (value as { countryCode?: string; number?: string }) ?? {};

  const countryCodes = useMemo(() => {
    const priority = config?.priorityCountries;
    if (!priority || priority.length === 0) return ALL_COUNTRY_CODES;
    const prioritySet = new Set(priority.map((c) => c.toUpperCase()));
    const priorityItems = ALL_COUNTRY_CODES.filter((c) => prioritySet.has(c.code));
    const rest = ALL_COUNTRY_CODES.filter((c) => !prioritySet.has(c.code));
    return [...priorityItems, ...rest];
  }, [config?.priorityCountries]);

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
          <SelectTrigger className="w-32 shrink-0" aria-label="Country code" onFocus={onFocus}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map((c, i) => {
              const priority = config?.priorityCountries;
              const showSeparator = priority && priority.length > 0 && i === priority.length;
              return (
                <div key={c.code}>
                  {showSeparator && <div className="my-1 h-px bg-border" role="separator" />}
                  <SelectItem value={c.code}>{c.label}</SelectItem>
                </div>
              );
            })}
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
