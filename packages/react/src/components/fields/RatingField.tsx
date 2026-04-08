import type { RatingConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "../../utils/cn";

export function RatingField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as RatingConfig | undefined;
  const max = config?.max ?? 5;
  const current = (value as number) ?? 0;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div
        className="flex gap-1"
        role="radiogroup"
        aria-label={field.label}
      >
        {Array.from({ length: max }, (_, i) => {
          const n = i + 1;
          const selected = n <= current;
          return (
            <button
              key={n}
              type="button"
              className={cn(
                "rounded-md p-1 transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50",
                selected ? "text-primary" : "text-muted-foreground",
              )}
              disabled={disabled}
              onClick={() => { onChange(n); onBlur(); }}
              aria-label={`${n} of ${max}`}
              aria-checked={n === current}
              role="radio"
            >
              <svg viewBox="0 0 24 24" fill={selected ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} width={28} height={28}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
