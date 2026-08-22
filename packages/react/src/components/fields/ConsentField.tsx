import { useState } from "react";
import type { ConsentConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Checkbox } from "../ui/checkbox";

type ConsentValue = boolean | { agreed: boolean; version?: string; timestamp?: string };

export function ConsentField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as ConsentConfig | undefined;
  const needsEnriched = !!(config?.consentVersion || config?.recordTimestamp);

  const checked = needsEnriched
    ? (value as { agreed?: boolean } | undefined)?.agreed === true
    : value === true;

  const [expanded, setExpanded] = useState(false);

  const handleChange = (val: boolean) => {
    if (needsEnriched) {
      const enriched: ConsentValue = {
        agreed: val,
        ...(config?.consentVersion ? { version: config.consentVersion } : {}),
        ...(config?.recordTimestamp && val ? { timestamp: new Date().toISOString() } : {}),
      };
      onChange(enriched);
    } else {
      onChange(val);
    }
    onBlur();
  };

  return (
    <FieldWrapper field={field} error={error} touched={touched} hideLabel>
      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            id={field.id}
            checked={checked}
            disabled={disabled || readonly}
            onCheckedChange={(val) => handleChange(val === true)}
            onFocus={onFocus}
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
