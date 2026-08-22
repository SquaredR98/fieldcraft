import type { PaymentConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";

export function PaymentField({ field, value: _value, error, touched, disabled: _disabled, readonly: _readonly, onChange: _onChange, onBlur: _onBlur, onFocus: _onFocus }: FieldProps) {
  const config = field.config as PaymentConfig | undefined;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="rounded-lg border border-input bg-muted/50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20} height={20} className="text-muted-foreground">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          <span className="text-sm font-medium text-foreground">
            Payment — {config?.provider ?? "stripe"}
          </span>
        </div>
        {config?.amount != null && (
          <p className="text-sm text-foreground mb-2">
            <span className="font-medium">
              {config.currency ?? "USD"} {config.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            {config.description && (
              <span className="text-muted-foreground"> — {config.description}</span>
            )}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Payment processing requires <code className="bg-muted px-1 rounded">@squaredr/fieldcraft-pro</code> or
          a custom field component override registered via the field registry.
        </p>
      </div>
    </FieldWrapper>
  );
}
