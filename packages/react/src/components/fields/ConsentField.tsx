import { useState } from "react";
import type { ConsentConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Checkbox } from "../ui/checkbox";

export function ConsentField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as ConsentConfig | undefined;
  const checked = value === true;
  const [expanded, setExpanded] = useState(false);

  return (
    <FieldWrapper field={field} error={error} touched={touched} hideLabel>
      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            id={field.id}
            checked={checked}
            disabled={disabled}
            onCheckedChange={(val) => { onChange(val === true); onBlur(); }}
            aria-required={field.required ? true : undefined}
            className="mt-0.5"
          />
          <span className="text-sm leading-relaxed">
            {config?.checkboxLabel ?? config?.text ?? field.label}
          </span>
        </label>

        {config?.expandableText && (
          <>
            <button
              type="button"
              className="self-start text-xs text-primary hover:underline"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
            {expanded && (
              <div className="text-xs text-muted-foreground rounded-md bg-muted/50 p-3 leading-relaxed">
                {config.expandableText}
              </div>
            )}
          </>
        )}
      </div>
    </FieldWrapper>
  );
}
