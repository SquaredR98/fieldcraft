import type { FormEngine, FormEngineTheme } from "@squaredr/fieldcraft-core";
import type { FieldRegistry } from "../registry/field-registry";
import { SectionRenderer } from "./SectionRenderer";

export type ClassicModeRendererProps = {
  engine: FormEngine;
  theme: FormEngineTheme;
  registry: FieldRegistry;
  autoFocus?: boolean;
};

/**
 * Classic mode: renders ALL visible sections at once in a scrollable layout.
 * No section-level navigation buttons — the user scrolls through the form
 * and submits at the bottom.
 */
export function ClassicModeRenderer({
  engine,
  theme,
  registry,
  autoFocus,
}: ClassicModeRendererProps) {
  const visibleSections = engine.getVisibleSections();

  return (
    <div className="fc-mode-classic flex flex-col gap-8">
      {visibleSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          engine={engine}
          theme={theme}
          registry={registry}
          autoFocus={autoFocus && section.id === visibleSections[0]?.id}
        />
      ))}
    </div>
  );
}
