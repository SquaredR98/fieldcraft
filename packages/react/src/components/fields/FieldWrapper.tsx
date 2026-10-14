import type { FieldProps } from "../../registry/field-registry";
import { Label } from "../ui/label";
import { cn } from "../../utils/cn";
import { FormattedText } from "../../utils/inline-markdown";

type FieldWrapperProps = Pick<FieldProps, "field" | "error" | "touched"> & {
  children: React.ReactNode;
  className?: string;
  hideLabel?: boolean;
  /**
   * Set for a **composite** field — one rendered as a group of controls rather
   * than a single focusable input: a rating strip, an NPS scale, a matrix, a
   * repeater, a signature canvas.
   *
   * `<label for>` is only valid when it points at one labelable element. For a
   * group there is no such element, so the label is rendered as plain text and
   * the group is expected to carry its own accessible name via
   * `groupAria(field, hasError)` on a `role="group"` or `role="radiogroup"`
   * container.
   *
   * Without this the wrapper emitted `<label for={field.id}>` pointing at an
   * element that did not exist — clicking it focused nothing and the field had
   * no accessible name (WCAG 1.3.1 / 4.1.2).
   *
   * @since 1.13.0
   */
  composite?: boolean;
};

export function FieldWrapper({
  field,
  error,
  touched,
  children,
  className,
  hideLabel,
  composite,
}: FieldWrapperProps) {
  const showError = touched && error && error.length > 0;
  const labelContent = (
    <>
      <FormattedText text={field.label} format={field.labelFormat} />
      {field.required && <span className="text-destructive" aria-hidden="true"> *</span>}
    </>
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {!hideLabel &&
        (composite ? (
          // No htmlFor: there is no single element to point at. The group
          // carries the accessible name instead, via groupAria().
          <span id={`${field.id}-label`} className="text-sm font-medium leading-none">
            {labelContent}
          </span>
        ) : (
          <Label htmlFor={field.id}>{labelContent}</Label>
        ))}
      {field.helpText && (
        <p className="text-sm text-muted-foreground" id={`${field.id}-help`}>
          <FormattedText text={field.helpText} format={field.helpTextFormat} />
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

/**
 * Aria attributes for a **composite** field's group container.
 *
 * Pairs with `FieldWrapper`'s `composite` prop: the label is rendered as text
 * with id `{field.id}-label`, and the group points at it with
 * `aria-labelledby`. That gives the group an accessible name without a
 * `<label for>` aimed at an element that does not exist.
 *
 * @since 1.13.0
 */
export function groupAria(field: FieldProps["field"], hasError: boolean) {
  return {
    "aria-labelledby": `${field.id}-label`,
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
