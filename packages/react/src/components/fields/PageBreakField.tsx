import type { PageBreakConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";

export function PageBreakField({ field }: FieldProps) {
  const config = field.config as PageBreakConfig | undefined;
  const label = config?.label ?? field.label;

  return (
    <div className="fc-page-break" role="separator" aria-label={label || "Page break"}>
      <div className="fc-page-break__line flex items-center gap-3 my-4">
        <hr className="fc-page-break__rule flex-1 border-border" />
        {label && (
          <span className="fc-page-break__label text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {label}
          </span>
        )}
        <hr className="fc-page-break__rule flex-1 border-border" />
      </div>
    </div>
  );
}
