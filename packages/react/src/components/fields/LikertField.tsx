import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "../../utils/cn";

export function LikertField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const options = field.options ?? [];
  const current = value as string | number | undefined;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={field.label}>
        {options.map((opt) => {
          const isSelected = current === opt.value;
          return (
            <label
              key={String(opt.value)}
              className={cn(
                "flex items-center justify-center px-4 py-2 rounded-md border text-sm font-medium transition-colors cursor-pointer select-none",
                isSelected
                  ? "fe-option-filled"
                  : "border-input bg-transparent text-foreground hover:bg-accent",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <input
                type="radio"
                name={field.id}
                value={String(opt.value)}
                checked={isSelected}
                disabled={disabled}
                onChange={() => { onChange(opt.value); onBlur(); }}
                className="sr-only"
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
