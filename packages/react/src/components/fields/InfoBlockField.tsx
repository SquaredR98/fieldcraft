import type { InfoBlockConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { cn } from "../../utils/cn";

const variantStyles: Record<string, string> = {
  info: "border-primary/30 bg-primary/5 text-foreground",
  warning: "border-yellow-500/30 bg-yellow-50 text-foreground",
  error: "border-destructive/30 bg-destructive/5 text-foreground",
  success: "border-green-500/30 bg-green-50 text-foreground",
};

export function InfoBlockField({ field }: FieldProps) {
  const config = field.config as InfoBlockConfig | undefined;
  const variant = config?.variant ?? "info";

  return (
    <Alert
      className={cn(variantStyles[variant] ?? variantStyles.info)}
      role={variant === "warning" || variant === "error" ? "alert" : "note"}
      aria-label={field.label}
    >
      {field.label && <AlertTitle>{field.label}</AlertTitle>}
      <AlertDescription>
        {config?.content ?? field.helpText}
      </AlertDescription>
    </Alert>
  );
}
