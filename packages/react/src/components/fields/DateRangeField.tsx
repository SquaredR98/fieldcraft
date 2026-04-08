import type { DateRangeConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function DateRangeField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as DateRangeConfig | undefined;
  const hasError = !!(touched && error?.length);
  const range = (value as { start?: string; end?: string }) ?? {};

  const update = (part: "start" | "end", val: string) => {
    onChange({ ...range, [part]: val || undefined });
  };

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex items-end gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor={`${field.id}-start`} className="text-xs">
            Start date
          </Label>
          <Input
            {...fieldAria(field, hasError)}
            id={`${field.id}-start`}
            type="date"
            value={range.start ?? ""}
            min={config?.minDate}
            max={range.end ?? config?.maxDate}
            disabled={disabled}
            onChange={(e) => update("start", e.target.value)}
            onBlur={onBlur}
          />
        </div>
        <span className="pb-2 text-sm text-muted-foreground" aria-hidden="true">to</span>
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor={`${field.id}-end`} className="text-xs">
            End date
          </Label>
          <Input
            id={`${field.id}-end`}
            type="date"
            value={range.end ?? ""}
            min={range.start ?? config?.minDate}
            max={config?.maxDate}
            disabled={disabled}
            onChange={(e) => update("end", e.target.value)}
            onBlur={onBlur}
          />
        </div>
      </div>
    </FieldWrapper>
  );
}
