import type { SectionHeaderConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { cn } from "../../utils/cn";

export function SectionHeaderField({ field }: FieldProps) {
  const config = field.config as SectionHeaderConfig | undefined;
  const level = config?.level ?? "h2";
  const showDivider = config?.showDivider ?? true;
  const Tag = level;

  return (
    <div className="fe-section-header" role="presentation">
      <Tag
        className={cn(
          "fe-section-header__title",
          level === "h2" && "text-xl font-semibold",
          level === "h3" && "text-lg font-semibold",
          level === "h4" && "text-base font-semibold",
        )}
      >
        {field.label}
      </Tag>
      {field.helpText && (
        <p className="fe-section-header__description text-sm text-muted-foreground mt-1">
          {field.helpText}
        </p>
      )}
      {showDivider && (
        <hr className="fe-section-header__divider border-border mt-3" />
      )}
    </div>
  );
}
