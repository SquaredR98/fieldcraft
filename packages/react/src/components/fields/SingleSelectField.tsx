import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "../../utils/cn";

export function SingleSelectField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const options = field.options ?? [];
  const current = value as string | number | boolean | undefined;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={field.label}>
        {options.map((opt) => {
          const isSelected = current === opt.value;
          return (
            <label
              key={String(opt.value)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors",
                isSelected
                  ? "fe-option-active"
                  : "border-input hover:bg-accent",
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
              <div className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                isSelected ? "border-primary" : "border-input",
              )}>
                {isSelected && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  {opt.icon && <span>{opt.icon}</span>}
                  <span className="text-sm font-medium">{opt.label}</span>
                </div>
                {opt.helpText && (
                  <span className="text-xs text-muted-foreground">{opt.helpText}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
