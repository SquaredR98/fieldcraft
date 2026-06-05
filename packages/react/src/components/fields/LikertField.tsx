import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { cn } from "../../utils/cn";

export function LikertField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const options = field.options ?? [];
  const current = value as string | number | undefined;
  const hasError = touched && !!error?.length;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <RadioGroup
        value={current != null ? String(current) : ""}
        onValueChange={(val) => { onChange(val); onBlur(); }}
        disabled={disabled}
        className="flex flex-wrap gap-2"
        aria-label={field.label}
        {...(hasError ? { "aria-invalid": true } : {})}
      >
        {options.map((opt) => {
          const optId = `${field.id}-${opt.value}`;
          const isSelected = current != null && String(current) === String(opt.value);
          return (
            <Label
              key={String(opt.value)}
              htmlFor={optId}
              className={cn(
                "flex items-center justify-center px-4 py-2 rounded-md border text-sm font-medium transition-colors cursor-pointer select-none",
                isSelected
                  ? "fc-option-filled"
                  : "border-input bg-transparent text-foreground hover:bg-accent",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <RadioGroupItem value={String(opt.value)} id={optId} className="sr-only" />
              <span>{opt.label}</span>
            </Label>
          );
        })}
      </RadioGroup>
    </FieldWrapper>
  );
}
