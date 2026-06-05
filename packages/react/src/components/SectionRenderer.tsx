import type {
  Section,
  Question,
  FormEngine,
  FormEngineTheme,
} from "@squaredr/fieldcraft-core";
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

type FieldGroup =
  | { kind: "single"; field: Question }
  | { kind: "grid"; columns: number; fields: Question[] };

/**
 * Groups adjacent fields that share the same `layout.columns` value
 * into grid groups. Fields without columns (or columns=1) render as singles.
 */
function groupFields(fields: Question[]): FieldGroup[] {
  const groups: FieldGroup[] = [];

  for (const field of fields) {
    const cols = field.layout?.columns;
    if (cols && cols > 1) {
      const last = groups[groups.length - 1];
      if (last && last.kind === "grid" && last.columns === cols) {
        last.fields.push(field);
      } else {
        groups.push({ kind: "grid", columns: cols, fields: [field] });
      }
    } else {
      groups.push({ kind: "single", field });
    }
  }

  return groups;
}

export function SectionRenderer({
  section,
  engine,
  theme,
  registry,
}: SectionRendererProps) {
  const state = engine.getState();
  const visibleFields = engine.getVisibleFields(section.id);

  const sectionLayout = theme.layout?.sectionLayout ?? "card";
  const fieldGroups = groupFields(visibleFields);

  return (
    <section
      className={cn(
        "flex flex-col gap-6",
        sectionVariants[sectionLayout] ?? sectionVariants.card,
      )}
      aria-labelledby={`fc-section-title-${section.id}`}
    >
      {section.title && (
        <h2
          id={`fc-section-title-${section.id}`}
          className="text-lg font-semibold text-foreground"
        >
          {section.title}
        </h2>
      )}
      {section.description && (
        <p className="text-sm text-muted-foreground -mt-2">{section.description}</p>
      )}

      <div className="flex flex-col gap-6">
        {fieldGroups.map((group, gi) => {
          if (group.kind === "single") {
            const field = group.field;
            return (
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
            );
          }

          // Grid group — render side by side, collapse on mobile
          return (
            <div
              key={`grid-${gi}`}
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${group.columns}, minmax(0, 1fr))`,
              }}
            >
              {group.fields.map((field) => (
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
          );
        })}
      </div>
    </section>
  );
}
