import type { PaymentConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";

export function PaymentField({ field, error, touched }: FieldProps) {
  const config = field.config as PaymentConfig | undefined;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="rounded-lg border border-input bg-muted/50 p-4">
        <p className="text-sm text-foreground">
          Payment ({config?.provider ?? "stripe"}) — integration placeholder.
          {config?.amount != null && (
            <span className="font-medium">
              {" "}Amount: {config.currency ?? "USD"} {config.amount}
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          The actual payment UI is provided by the payment provider&apos;s SDK
          and should be integrated via a custom field component override.
        </p>
      </div>
    </FieldWrapper>
  );
}
