import type { DividerConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { Separator } from "../ui/separator";

export function DividerField({ field }: FieldProps) {
  const config = field.config as DividerConfig | undefined;

  const style = config?.style ?? "solid";
  const color = config?.color;
  const thickness = config?.thickness ?? 1;
  const spacing = config?.spacing ?? 16;

  // For default config (solid, 1px, default color), use the shadcn Separator
  if (!color && style === "solid" && thickness === 1) {
    return (
      <div
        className="w-full"
        style={{ paddingBlock: `${spacing}px` }}
        aria-hidden="true"
      >
        <Separator />
      </div>
    );
  }

  // For custom config, use CSS custom properties for dynamic values
  return (
    <hr
      className="w-full border-0 border-t border-border"
      style={
        {
          "--fc-divider-style": style,
          "--fc-divider-color": color ?? "hsl(var(--border))",
          "--fc-divider-thickness": `${thickness}px`,
          borderStyle: "var(--fc-divider-style)",
          borderColor: "var(--fc-divider-color)",
          borderTopWidth: "var(--fc-divider-thickness)",
          marginBlock: `${spacing}px`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    />
  );
}
