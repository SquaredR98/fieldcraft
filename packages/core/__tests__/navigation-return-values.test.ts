import { describe, it, expect } from "vitest";
import { createEngine } from "../src/engine/create-engine";
import type { FormEngineSchema } from "../src/types/schema";

/**
 * `nextSection()` / `prevSection()` report whether they moved.
 *
 * Both were declared `void` on the public `FormEngine` interface while the
 * state manager always returned a boolean — the wrapper discarded it. A caller
 * therefore could not tell a refusal from a success, which matters because
 * there are now three silent refusal paths: validation failed, an async check
 * is in flight, or there is no next section.
 *
 * `nextQuestion()` / `prevQuestion()` already forwarded their result, so this
 * was an inconsistency as much as a gap.
 */

function twoSections(): FormEngineSchema {
  return {
    id: "nav-returns",
    version: "1.0.0",
    submitAction: { type: "callback" },
    title: "Nav",
    settings: { displayMode: "stepped" },
    sections: [
      {
        id: "s1",
        title: "One",
        // Requiredness is the field PROPERTY, not a validation rule — a
        // `{ type: "required" }` rule in the array does not gate navigation.
        questions: [{ id: "a", type: "short_text", label: "A", required: true }],
      },
      {
        id: "s2",
        title: "Two",
        questions: [{ id: "b", type: "short_text", label: "B" }],
      },
    ],
  };
}

describe("nextSection() return value", () => {
  it("returns false and does not move when the section is invalid", () => {
    const engine = createEngine(twoSections(), {});

    expect(engine.nextSection()).toBe(false);
    expect(engine.getState().currentSectionId).toBe("s1");
  });

  it("returns true when it advances", () => {
    const engine = createEngine(twoSections(), {});
    engine.setValue("a", "filled");

    expect(engine.nextSection()).toBe(true);
    expect(engine.getState().currentSectionId).toBe("s2");
  });

  it("returns false on the last section", () => {
    const engine = createEngine(twoSections(), {});
    engine.setValue("a", "filled");
    engine.nextSection();

    expect(engine.nextSection()).toBe(false);
  });

  it("returns false while an async check is in flight", async () => {
    const schema = twoSections();
    schema.sections[0].questions[0].validation = [
      { type: "async", endpoint: "check" },
    ];
    let release: (() => void) | undefined;
    const engine = createEngine(schema, {
      asyncValidators: {
        check: () =>
          new Promise<string | null>((r) => {
            release = () => r(null);
          }),
      },
    });

    engine.setValue("a", "filled");
    engine.touchField("a");

    // The answer is not known yet, so the refusal must be reported — not
    // silently swallowed as it would have been when this returned void.
    expect(engine.nextSection()).toBe(false);

    release?.();
  });
});

describe("prevSection() return value", () => {
  it("returns true when it moves back", () => {
    const engine = createEngine(twoSections(), {});
    engine.setValue("a", "filled");
    engine.nextSection();

    expect(engine.prevSection()).toBe(true);
    expect(engine.getState().currentSectionId).toBe("s1");
  });

  it("returns false on the first section", () => {
    const engine = createEngine(twoSections(), {});

    expect(engine.prevSection()).toBe(false);
  });
});
