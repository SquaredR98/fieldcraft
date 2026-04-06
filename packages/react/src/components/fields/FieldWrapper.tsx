import type { FieldProps } from "../../registry/field-registry";
import { Label } from "../ui/label";
import { cn } from "../../utils/cn";

type FieldWrapperProps = Pick<FieldProps, "field" | "error" | "touched"> & {
  children: React.ReactNode;
  className?: string;
  hideLabel?: boolean;
};

export function FieldWrapper({
  field,
  error,
  touched,
  children,
  className,
  hideLabel,
}: FieldWrapperProps) {
  const showError = touched && error && error.length > 0;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {!hideLabel && (
        <Label htmlFor={field.id}>
          {field.label}
          {field.required && <span className="text-destructive" aria-hidden="true"> *</span>}
        </Label>
      )}
      {field.helpText && (
        <p className="text-sm text-muted-foreground" id={`${field.id}-help`}>
          {field.helpText}
        </p>
      )}
      {children}
      {showError && (
        <div className="text-sm text-destructive font-medium" role="alert" id={`${field.id}-error`}>
          {error![0]}
        </div>
      )}
    </div>
  );
}

/** Build common aria attributes for an input element. */
export function fieldAria(field: FieldProps["field"], hasError: boolean) {
  return {
    id: field.id,
    "aria-describedby": [
      field.helpText ? `${field.id}-help` : undefined,
      hasError ? `${field.id}-error` : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined,
    "aria-invalid": hasError ? (true as const) : undefined,
    "aria-required": field.required ? (true as const) : undefined,
  };
}
