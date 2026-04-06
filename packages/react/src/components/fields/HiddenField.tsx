import type { FieldProps } from "../../registry/field-registry";

/** Hidden fields render nothing visible but still hold a value in form state. */
export function HiddenField({ field, value }: FieldProps) {
  return (
    <input
      type="hidden"
      id={field.id}
      name={field.id}
      value={value != null ? String(value) : ""}
    />
  );
}
