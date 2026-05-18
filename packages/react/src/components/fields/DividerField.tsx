import type { DividerConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";

export function DividerField({ field }: FieldProps) {
  const config = field.config as DividerConfig | undefined;

  const style = config?.style ?? "solid";
  const color = config?.color ?? "#e5e7eb";
  const thickness = config?.thickness ?? 1;
  const spacing = config?.spacing ?? 16;

  return (
    <hr
      style={{
        borderStyle: style,
        borderColor: color,
        borderWidth: `${thickness}px 0 0 0`,
        margin: `${spacing}px 0`,
        width: "100%",
      }}
      aria-hidden="true"
    />
  );
}
