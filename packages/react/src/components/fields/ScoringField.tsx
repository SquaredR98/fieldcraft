import type { ScoringConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "../../utils/cn";
import { Badge } from "../ui/badge";

export function ScoringField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as ScoringConfig | undefined;
  const options = config?.options ?? [];
  const current = value as string | undefined;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={field.label}>
        {options.map((opt) => {
          const isSelected = current === opt.value;
          return (
            <label
              key={opt.value}
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
                value={opt.value}
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
              <span className="text-sm font-medium flex-1">{opt.label}</span>
              {config?.showScore && (
                <Badge variant="secondary" className="text-xs">
                  {opt.score} pts
                </Badge>
              )}
            </label>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
