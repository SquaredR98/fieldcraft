import type { NumberConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Input } from "../ui/input";

export function NumberField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as NumberConfig | undefined;
  const hasError = !!(touched && error?.length);

  const handleBlur = () => {
    if (config?.decimalPlaces != null && value != null && value !== "") {
      const num = Number(value);
      if (!isNaN(num)) {
        onChange(Number(num.toFixed(config.decimalPlaces)));
      }
    }
    onBlur();
  };

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex items-center gap-2">
        {config?.prefix && (
          <span className="text-sm text-muted-foreground shrink-0">{config.prefix}</span>
        )}
        <Input
          {...fieldAria(field, hasError)}
          type="number"
          value={value !== undefined && value !== null ? String(value) : ""}
          placeholder={field.placeholder}
          min={config?.min}
          max={config?.max}
          step={config?.step ?? 1}
          disabled={disabled}
          readOnly={readonly}
          onChange={(e) => {
            const raw = e.target.value;
            onChange(raw === "" ? undefined : Number(raw));
          }}
          onBlur={handleBlur}
          onFocus={onFocus}
        />
        {config?.suffix && (
          <span className="text-sm text-muted-foreground shrink-0">{config.suffix}</span>
        )}
      </div>
    </FieldWrapper>
  );
}
