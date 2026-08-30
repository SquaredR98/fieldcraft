import type { PaymentConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export function PaymentField({
  field,
  value: _value,
  error,
  touched,
  disabled: _disabled,
  readonly: _readonly,
  onChange: _onChange,
  onBlur: _onBlur,
  onFocus: _onFocus,
}: FieldProps) {
  const config = field.config as PaymentConfig | undefined;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <Card className="py-4 gap-3 bg-muted/30">
        <CardHeader className="px-4 py-0 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={18} height={18} className="text-muted-foreground">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <CardTitle className="text-sm font-medium">
              Payment Checkout
            </CardTitle>
          </div>
          {config?.provider && (
            <Badge variant="outline" className="text-xs uppercase font-normal">
              {config.provider}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="px-4 py-0 flex flex-col gap-2">
          {config?.amount != null && (
            <p className="text-sm text-foreground">
              <span className="font-semibold text-base">
                {config.currency ?? "USD"} {config.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              {config.description && (
                <span className="text-muted-foreground text-xs ml-2">({config.description})</span>
              )}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Payment processing requires <code className="bg-muted px-1 rounded font-mono text-[11px]">@squaredr/fieldcraft-pro</code> or
            a custom field component override registered via the field registry.
          </p>
        </CardContent>
      </Card>
    </FieldWrapper>
  );
}
