import type { LongTextConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Textarea } from "../ui/textarea";

export function LongTextField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as LongTextConfig | undefined;
  const hasError = !!(touched && error?.length);
  const text = (value as string) ?? "";

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <Textarea
        {...fieldAria(field, hasError)}
        value={text}
        placeholder={field.placeholder}
        rows={config?.rows ?? 4}
        maxLength={config?.maxLength}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {config?.maxLength && (
        <span className="text-xs text-muted-foreground text-right">
          {text.length} / {config.maxLength}
        </span>
      )}
    </FieldWrapper>
  );
}
