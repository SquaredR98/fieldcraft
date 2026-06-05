import type { ScoringConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { cn } from "../../utils/cn";

export function ScoringField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as ScoringConfig | undefined;
  const options = config?.options ?? [];
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
          const isSelected = current === opt.value;
          return (
            <Label
              key={opt.value}
              htmlFor={optId}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors font-normal",
                isSelected
                  ? "fc-option-active"
                  : "border-input hover:bg-accent",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <RadioGroupItem value={opt.value} id={optId} />
              <span className="text-sm font-medium flex-1">{opt.label}</span>
              {config?.showScore && (
                <Badge variant="secondary" className="text-xs">
                  {opt.score} pts
                </Badge>
              )}
            </Label>
          );
        })}
      </RadioGroup>
    </FieldWrapper>
  );
}
