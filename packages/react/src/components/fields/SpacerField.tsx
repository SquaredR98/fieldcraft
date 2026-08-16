import type { SpacerConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";

export function SpacerField({ field, value: _value, error: _error, touched: _touched, disabled: _disabled, readonly: _readonly, onChange: _onChange, onBlur: _onBlur, onFocus: _onFocus }: FieldProps) {
  const config = field.config as SpacerConfig | undefined;

  const height = config?.height ?? 32;

  return <div style={{ height: `${height}px` }} aria-hidden="true" />;
}
