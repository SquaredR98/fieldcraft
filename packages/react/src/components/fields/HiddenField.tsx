import type { FieldProps } from "../../registry/field-registry";

/** Hidden fields render nothing visible but still hold a value in form state. */
export function HiddenField({ field, value, error: _error, touched: _touched, disabled: _disabled, readonly: _readonly, onChange: _onChange, onBlur: _onBlur, onFocus: _onFocus }: FieldProps) {
  return (
    <input
      type="hidden"
      id={field.id}
      name={field.id}
      value={value != null ? String(value) : ""}
    />
  );
}
