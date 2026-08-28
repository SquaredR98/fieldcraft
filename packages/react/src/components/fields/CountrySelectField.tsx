import { useMemo } from "react";
import type { CountrySelectConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { COUNTRIES } from "@squaredr/fieldcraft-core";

/** Convert a 2-letter country code to its flag emoji (regional indicator symbols). */
function codeToFlag(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0)),
  );
}

export function CountrySelectField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as CountrySelectConfig | undefined;
  const hasError = !!(touched && error?.length);
  const options = field.options;
  const aria = fieldAria(field, hasError);
  const showFlags = config?.showFlags !== false;

  const countries = useMemo(() => {
    let list = options
      ? options.map((o) => ({ code: String(o.value), name: o.label }))
      : COUNTRIES;

    // Exclude countries
    const exclude = config?.excludeCountries;
    if (exclude && exclude.length > 0) {
      const excludeSet = new Set(exclude.map((c) => c.toUpperCase()));
      list = list.filter((c) => !excludeSet.has(c.code.toUpperCase()));
    }

    // Priority countries
    const priority = config?.priorityCountries;
    if (priority && priority.length > 0) {
      const prioritySet = new Set(priority.map((c) => c.toUpperCase()));
      const priorityItems = list.filter((c) => prioritySet.has(c.code.toUpperCase()));
      const rest = list.filter((c) => !prioritySet.has(c.code.toUpperCase()));
      return { items: [...priorityItems, ...rest], separatorIndex: priorityItems.length };
    }

    return { items: list, separatorIndex: -1 };
  }, [options, config?.excludeCountries, config?.priorityCountries]);

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
          {countries.items.map((c, i) => (
            <div key={c.code}>
              {i === countries.separatorIndex && countries.separatorIndex > 0 && (
                <div className="my-1 h-px bg-border" role="separator" />
              )}
              <SelectItem value={c.code}>
                {showFlags ? `${codeToFlag(c.code)} ${c.name}` : c.name}
              </SelectItem>
            </div>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}
