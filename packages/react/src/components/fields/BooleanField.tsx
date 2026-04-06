import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "../../utils/cn";

export function BooleanField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const current = value as boolean | undefined;
  const options = field.options ?? [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex gap-2" role="radiogroup" aria-label={field.label}>
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={current === opt.value}
            className={cn(
              "flex-1 h-10 rounded-md border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              current === opt.value
                ? "fe-option-active"
                : "border-input bg-transparent text-foreground hover:bg-accent",
            )}
            disabled={disabled}
            onClick={() => { onChange(opt.value); onBlur(); }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </FieldWrapper>
  );
}
