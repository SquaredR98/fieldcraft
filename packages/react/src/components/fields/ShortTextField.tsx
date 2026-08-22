import type { ShortTextConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Input } from "../ui/input";

export function ShortTextField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as ShortTextConfig | undefined;
  const hasError = !!(touched && error?.length);
  const hasAdornment = !!(config?.prefix || config?.suffix);

  const input = (
    <Input
      {...fieldAria(field, hasError)}
      type={config?.inputType ?? "text"}
      value={(value as string) ?? ""}
      placeholder={field.placeholder}
      maxLength={config?.maxLength}
      disabled={disabled}
      readOnly={readonly}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      {hasAdornment ? (
        <div className="flex items-center gap-2">
          {config?.prefix && (
            <span className="text-sm text-muted-foreground shrink-0">{config.prefix}</span>
          )}
          {input}
          {config?.suffix && (
            <span className="text-sm text-muted-foreground shrink-0">{config.suffix}</span>
          )}
        </div>
      ) : (
        input
      )}
    </FieldWrapper>
  );
}
