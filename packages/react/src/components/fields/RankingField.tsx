import { useState } from "react";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";

export function RankingField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const options = field.options ?? [];
  const ranked = (value as (string | number | boolean)[]) ?? options.map((o) => o.value);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const moveItem = (from: number, to: number) => {
    const next = [...ranked];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    onBlur();
  };

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <ol className="flex flex-col gap-1.5 list-none p-0 m-0" role="list" aria-label={`Rank ${field.label}`}>
        {ranked.map((val, index) => {
          const opt = options.find((o) => o.value === val);
          return (
            <li
              key={String(val)}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-input px-3.5 py-2 bg-card text-card-foreground transition-shadow shadow-xs",
                dragIndex === index && "shadow-md opacity-70",
                (disabled || readonly) && "opacity-50",
              )}
              draggable={!disabled && !readonly}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) moveItem(dragIndex, index);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
            >
              <span className="text-muted-foreground cursor-grab select-none text-xs" aria-hidden="true">
                &#x2630;
              </span>
              <span className="text-xs font-semibold text-muted-foreground w-5">{index + 1}.</span>
              <span className="flex-1 text-sm font-medium">{opt?.label ?? String(val)}</span>
              <div className="flex flex-col gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="h-5 w-5 text-muted-foreground hover:text-foreground"
                  disabled={disabled || readonly || index === 0}
                  onClick={() => moveItem(index, index - 1)}
                  onFocus={onFocus}
                  aria-label={`Move ${opt?.label ?? val} up`}
                >
                  &#x25B2;
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="h-5 w-5 text-muted-foreground hover:text-foreground"
                  disabled={disabled || readonly || index === ranked.length - 1}
                  onClick={() => moveItem(index, index + 1)}
                  onFocus={onFocus}
                  aria-label={`Move ${opt?.label ?? val} down`}
                >
                  &#x25BC;
                </Button>
              </div>
            </li>
          );
        })}
      </ol>
    </FieldWrapper>
  );
}
