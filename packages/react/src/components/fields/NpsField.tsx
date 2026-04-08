import type { NpsConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "../../utils/cn";

export function NpsField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as NpsConfig | undefined;
  const current = value as number | undefined;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={field.label}>
        <div className="flex gap-0.5">
          {Array.from({ length: 11 }, (_, i) => {
            const isSelected = current === i;
            const colorClass = i <= 6
              ? "border-red-300 hover:bg-red-50 text-red-700"
              : i <= 8
                ? "border-yellow-300 hover:bg-yellow-50 text-yellow-700"
                : "border-green-300 hover:bg-green-50 text-green-700";
            const activeClass = i <= 6
              ? "bg-red-500 border-red-500 text-white"
              : i <= 8
                ? "bg-yellow-500 border-yellow-500 text-white"
                : "bg-green-500 border-green-500 text-white";

            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={cn(
                  "flex-1 h-10 rounded-md border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  isSelected ? activeClass : colorClass,
                )}
                disabled={disabled}
                onClick={() => { onChange(i); onBlur(); }}
              >
                {i}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{config?.lowLabel ?? "Not likely"}</span>
          <span>{config?.highLabel ?? "Very likely"}</span>
        </div>
      </div>
    </FieldWrapper>
  );
}
