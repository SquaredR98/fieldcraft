import type { SpacerConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";

export function SpacerField({ field }: FieldProps) {
  const config = field.config as SpacerConfig | undefined;

  const height = config?.height ?? 32;

  return <div style={{ height: `${height}px` }} aria-hidden="true" />;
}
