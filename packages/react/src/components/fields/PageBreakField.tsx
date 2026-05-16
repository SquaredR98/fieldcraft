import type { PageBreakConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";

export function PageBreakField({ field }: FieldProps) {
  const config = field.config as PageBreakConfig | undefined;
  const label = config?.label ?? field.label;

  return (
    <div className="fe-page-break" role="separator" aria-label={label || "Page break"}>
      <div className="fe-page-break__line flex items-center gap-3 my-4">
        <hr className="fe-page-break__rule flex-1 border-border" />
        {label && (
          <span className="fe-page-break__label text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {label}
          </span>
        )}
        <hr className="fe-page-break__rule flex-1 border-border" />
      </div>
    </div>
  );
}
