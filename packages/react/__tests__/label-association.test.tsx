import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * `REACT-02` — every field's label resolves to something.
 *
 * `FieldWrapper` emits `<Label htmlFor={field.id}>`, but 14 components never
 * set a matching `id` on anything. The label pointed at an element that did
 * not exist: clicking it focused nothing, and the field had no accessible
 * name — WCAG 1.3.1 and 4.1.2.
 *
 * Three legitimate shapes, and this asserts every component is one of them:
 *
 * 1. **Single input** — `fieldAria()` (or its own `id={field.id}`) makes
 *    `htmlFor` resolve.
 * 2. **Composite** — a group of controls with no single labelable element.
 *    The wrapper takes `composite`, rendering the label as text with id
 *    `{field.id}-label`, and the group names itself via `groupAria()`.
 * 3. **Display type** — no `FieldWrapper`, so no label is emitted at all.
 *
 * A source-level test rather than a render test, because the failure is
 * structural: 44 components, and the thing that regresses is someone adding
 * a 45th without picking one of the three shapes. Rendering each would be
 * slower and would not catch the omission as directly.
 */

const FIELDS_DIR = join(__dirname, "..", "src", "components", "fields");

type Shape = "single" | "composite" | "display";

function classify(source: string): Shape | "orphan" {
  if (!source.includes("FieldWrapper")) return "display";
  if (source.includes("composite")) return "composite";
  if (source.includes("fieldAria")) return "single";
  if (/id=\{field\.id\}/.test(source)) return "single";
  return "orphan";
}

const components = readdirSync(FIELDS_DIR)
  .filter((f) => f.endsWith("Field.tsx"))
  .map((f) => ({
    name: f.replace(".tsx", ""),
    source: readFileSync(join(FIELDS_DIR, f), "utf-8"),
  }));

describe("REACT-02 — label association", () => {
  it("finds every field component", () => {
    // Guards the guard: if the glob breaks, the suite below passes vacuously.
    expect(components.length).toBeGreaterThanOrEqual(44);
  });

  it.each(components.map((c) => [c.name, c.source] as const))(
    "%s has a label that resolves",
    (name, source) => {
      const shape = classify(source);
      expect(
        shape,
        `${name} emits <label htmlFor={field.id}> but sets no matching id. ` +
          `Either call fieldAria() on its input, or mark the wrapper ` +
          `composite and name the group with groupAria().`,
      ).not.toBe("orphan");
    },
  );

  it("every composite names its group", () => {
    // `composite` alone only stops the label pointing nowhere. Without
    // groupAria the group has no accessible name, which trades one WCAG
    // failure for another.
    const missing = components
      .filter((c) => classify(c.source) === "composite")
      .filter((c) => !c.source.includes("groupAria"))
      .map((c) => c.name);

    expect(missing).toEqual([]);
  });
});
