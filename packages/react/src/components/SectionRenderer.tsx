import type {
  Section,
  FormEngine,
  FormEngineTheme,
} from "@squaredr/formengine-core";
import type { FieldRegistry } from "../registry/field-registry";
import { FieldRenderer } from "./FieldRenderer";
import { cn } from "../utils/cn";

export type SectionRendererProps = {
  section: Section;
  engine: FormEngine;
  theme: FormEngineTheme;
  registry: FieldRegistry;
};

const sectionVariants: Record<string, string> = {
  card: "bg-card text-card-foreground rounded-xl px-6 py-7 shadow-sm",
  bordered: "border border-border rounded-xl px-6 py-7",
  flat: "p-0",
};

export function SectionRenderer({
  section,
  engine,
  theme,
  registry,
}: SectionRendererProps) {
  const state = engine.getState();
  const visibleFields = engine.getVisibleFields(section.id);

  const sectionLayout = theme.layout?.sectionLayout ?? "card";

  return (
    <section
      className={cn(
        "flex flex-col gap-6",
        sectionVariants[sectionLayout] ?? sectionVariants.card,
      )}
      aria-labelledby={`fe-section-title-${section.id}`}
    >
      {section.title && (
        <h2
          id={`fe-section-title-${section.id}`}
          className="text-lg font-semibold text-foreground"
        >
          {section.title}
        </h2>
      )}
      {section.description && (
        <p className="text-sm text-muted-foreground -mt-2">{section.description}</p>
      )}

      <div className="flex flex-col gap-6">
        {visibleFields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={state.values[field.id]}
            error={state.errors[field.id]}
            touched={!!state.touched[field.id]}
            disabled={engine.isFieldDisabled(field.id)}
            onChange={(val) => engine.setValue(field.id, val)}
            onBlur={() => engine.touchField(field.id)}
            theme={theme}
            registry={registry}
          />
        ))}
      </div>
    </section>
  );
}
