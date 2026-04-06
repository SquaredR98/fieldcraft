import type { SliderConfig } from "@squaredr/formengine-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Slider } from "../ui/slider";

export function SliderField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as SliderConfig | undefined;
  const min = config?.min ?? 0;
  const max = config?.max ?? 100;
  const step = config?.step ?? 1;
  const current = (value as number) ?? min;
  const aria = fieldAria(field, !!(touched && error?.length));

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-2 pt-1">
        <Slider
          aria-label={field.label}
          aria-describedby={aria["aria-describedby"]}
          aria-invalid={aria["aria-invalid"]}
          min={min}
          max={max}
          step={step}
          value={[current]}
          disabled={disabled}
          onValueChange={(vals) => onChange(vals[0])}
          onValueCommit={() => onBlur()}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{config?.minLabel ?? min}</span>
          <span className="font-medium text-foreground">{current}</span>
          <span>{config?.maxLabel ?? max}</span>
        </div>
      </div>
    </FieldWrapper>
  );
}
