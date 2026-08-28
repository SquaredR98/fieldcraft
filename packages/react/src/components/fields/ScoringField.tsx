import type { ScoringConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { cn } from "../../utils/cn";

export function ScoringField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as ScoringConfig | undefined;
  const options = config?.options ?? [];
  const current = value as string | undefined;
  const hasError = touched && !!error?.length;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <RadioGroup
        value={current || undefined}
        onValueChange={(val) => { onChange(val); onBlur(); }}
        disabled={disabled || readonly}
        className="flex flex-col gap-2"
        aria-label={field.label}
        onFocus={onFocus}
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
                (disabled || readonly) && "cursor-not-allowed opacity-50",
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
      {current && config?.scoreRanges?.length ? (() => {
        const selectedOpt = options.find((o) => o.value === current);
        if (!selectedOpt) return null;
        const score = selectedOpt.score;
        const range = config.scoreRanges.find((r) => score >= r.min && score <= r.max);
        if (!range) return null;
        return (
          <div
            className="mt-3 rounded-md border px-3 py-2 text-sm"
            style={range.color ? { borderColor: range.color, color: range.color } : undefined}
          >
            <span className="font-medium">{range.label}</span>
            {range.description && <span className="text-muted-foreground ml-2">— {range.description}</span>}
          </div>
        );
      })() : null}
    </FieldWrapper>
  );
}
