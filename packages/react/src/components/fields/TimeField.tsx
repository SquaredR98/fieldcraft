import { useMemo } from "react";
import { ClockIcon } from "lucide-react";
import type { TimeConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function generateTimeOptions(step: number, format: "12h" | "24h"): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += step) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const val = `${hh}:${mm}`;

      let label: string;
      if (format === "12h") {
        const period = h >= 12 ? "PM" : "AM";
        const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
        label = `${h12}:${mm} ${period}`;
      } else {
        label = val;
      }
      options.push({ value: val, label });
    }
  }
  return options;
}

export function TimeField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as TimeConfig | undefined;
  const hasError = !!(touched && error?.length);
  const minuteStep = config?.minuteStep ?? 15;
  const timeFormat = config?.format ?? "12h";

  const timeOptions = useMemo(
    () => generateTimeOptions(minuteStep, timeFormat),
    [minuteStep, timeFormat],
  );

  const aria = fieldAria(field, hasError);

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
          <div className="flex items-center gap-2">
            <ClockIcon className="size-4 text-muted-foreground" />
            <SelectValue placeholder={field.placeholder ?? "Select time"} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {timeOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}
