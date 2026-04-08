import type { NumberConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Input } from "../ui/input";

export function NumberField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as NumberConfig | undefined;
  const hasError = !!(touched && error?.length);

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex items-center gap-2">
        <Input
          {...fieldAria(field, hasError)}
          type="number"
          value={value !== undefined && value !== null ? String(value) : ""}
          placeholder={field.placeholder}
          min={config?.min}
          max={config?.max}
          step={config?.step ?? 1}
          disabled={disabled}
          onChange={(e) => {
            const raw = e.target.value;
            onChange(raw === "" ? undefined : Number(raw));
          }}
          onBlur={onBlur}
        />
        {config?.suffix && (
          <span className="text-sm text-muted-foreground shrink-0">{config.suffix}</span>
        )}
      </div>
    </FieldWrapper>
  );
}
