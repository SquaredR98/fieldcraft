import type { RatingConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "../../utils/cn";

export function RatingField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as RatingConfig | undefined;
  const max = config?.max ?? 5;
  const current = (value as number) ?? 0;

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled || readonly) return;
    let next = current;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = Math.min(current + 1, max);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = Math.max(current - 1, 1);
        break;
      case "Home":
        next = 1;
        break;
      case "End":
        next = max;
        break;
      default:
        return;
    }
    e.preventDefault();
    onChange(next);
  }

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div
        className="flex gap-1"
        role="radiogroup"
        aria-label={field.label}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
      >
        {Array.from({ length: max }, (_, i) => {
          const n = i + 1;
          const selected = n <= current;
          return (
            <button
              key={n}
              type="button"
              tabIndex={n === (current || 1) ? 0 : -1}
              className={cn(
                "rounded-md p-1 transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50",
                selected ? "text-primary" : "text-muted-foreground",
              )}
              disabled={disabled || readonly}
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
