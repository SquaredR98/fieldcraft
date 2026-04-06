import { useState } from "react";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "../../utils/cn";

export function RankingField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
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
      <ol className="flex flex-col gap-1 list-none p-0 m-0" role="list" aria-label={`Rank ${field.label}`}>
        {ranked.map((val, index) => {
          const opt = options.find((o) => o.value === val);
          return (
            <li
              key={String(val)}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-input px-4 py-2.5 bg-card transition-shadow",
                dragIndex === index && "shadow-md opacity-70",
                disabled && "opacity-50",
              )}
              draggable={!disabled}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) moveItem(dragIndex, index);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
            >
              <span className="text-muted-foreground cursor-grab select-none" aria-hidden="true">
                &#x2630;
              </span>
              <span className="text-xs font-medium text-muted-foreground w-5">{index + 1}.</span>
              <span className="flex-1 text-sm">{opt?.label ?? String(val)}</span>
              <div className="flex flex-col">
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 p-0.5"
                  disabled={disabled || index === 0}
                  onClick={() => moveItem(index, index - 1)}
                  aria-label={`Move ${opt?.label ?? val} up`}
                >
                  &#x25B2;
                </button>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 p-0.5"
                  disabled={disabled || index === ranked.length - 1}
                  onClick={() => moveItem(index, index + 1)}
                  aria-label={`Move ${opt?.label ?? val} down`}
                >
                  &#x25BC;
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </FieldWrapper>
  );
}
