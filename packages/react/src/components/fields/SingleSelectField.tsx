import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { cn } from "../../utils/cn";

export function SingleSelectField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const options = field.options ?? [];
  const current = value as string | undefined;
  const hasError = touched && !!error?.length;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <RadioGroup
        value={current ?? ""}
        onValueChange={(val) => { onChange(val); onBlur(); }}
        disabled={disabled}
        className="flex flex-col gap-2"
        aria-label={field.label}
        {...(hasError ? { "aria-invalid": true } : {})}
      >
        {options.map((opt) => {
          const optId = `${field.id}-${opt.value}`;
          const isSelected = current === String(opt.value);
          return (
            <Label
              key={String(opt.value)}
              htmlFor={optId}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors font-normal",
                isSelected
                  ? "fc-option-active"
                  : "border-input hover:bg-accent",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <RadioGroupItem value={String(opt.value)} id={optId} />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  {opt.icon && <span>{opt.icon}</span>}
                  <span className="text-sm font-medium">{opt.label}</span>
                </div>
                {opt.helpText && (
                  <span className="text-xs text-muted-foreground">{opt.helpText}</span>
                )}
              </div>
            </Label>
          );
        })}
      </RadioGroup>
    </FieldWrapper>
  );
}
