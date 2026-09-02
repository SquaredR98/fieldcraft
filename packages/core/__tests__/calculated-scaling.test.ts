import { describe, it, expect } from "vitest";
import { createEngine } from "../src/engine/create-engine";
import type { FormEngineSchema, Question } from "../src/types/schema";

/**
 * Regression guard: calculated-field evaluation must stay linear in the
 * number of calculated fields. `evaluateCalculatedSubset` previously cloned
 * `values` and `warnings` on every iteration, making a deep chain O(n²)
 * (~16ms per keystroke at depth 400).
 */
function chainSchema(depth: number): FormEngineSchema {
  const questions: Question[] = [{ id: "base", type: "number", label: "base" } as Question];
  for (let i = 0; i < depth; i++) {
    const prev = i === 0 ? "base" : `c${i - 1}`;
    questions.push({
      id: `c${i}`,
      type: "calculated",
      label: `c${i}`,
      config: { type: "calculated", expression: `{${prev}} + 1` },
    } as Question);
  }
  return {
    id: "chain",
    version: "1.0.0",
    title: "Chain",
    sections: [{ id: "s0", title: "S", questions }],
    submitAction: { type: "callback" },
  };
}

describe("calculated field scaling", () => {
  it("propagates a deep dependency chain correctly", () => {
    const engine = createEngine(chainSchema(5), { onSubmit: async () => {} });
    engine.setValue("base", 10);
    const values = engine.getState().values;
    expect(values.c0).toBe(11);
    expect(values.c4).toBe(15);
  });

  it("resolves dependencies declared out of order (topological sort)", () => {
    const schema: FormEngineSchema = {
      id: "rev",
      version: "1.0.0",
      title: "Rev",
      sections: [
        {
          id: "s0",
          title: "S",
          questions: [
            { id: "c1", type: "calculated", label: "c1", config: { type: "calculated", expression: "{c0} + 1" } },
            { id: "c0", type: "calculated", label: "c0", config: { type: "calculated", expression: "{base} + 1" } },
            { id: "base", type: "number", label: "base" },
          ] as Question[],
        },
      ],
      submitAction: { type: "callback" },
    };
    const engine = createEngine(schema, { onSubmit: async () => {} });
    engine.setValue("base", 10);
    expect(engine.getState().values.c0).toBe(11);
    expect(engine.getState().values.c1).toBe(12);
  });

  it("scales sub-quadratically with chain depth", () => {
    const measure = (depth: number) => {
      const engine = createEngine(chainSchema(depth), { onSubmit: async () => {} });
      for (let i = 0; i < 5; i++) engine.setValue("base", i);
      const start = performance.now();
      for (let i = 0; i < 30; i++) engine.setValue("base", i);
      return (performance.now() - start) / 30;
    };

    const at100 = measure(100);
    const at400 = measure(400);

    // 4x the fields must cost well under 16x (the quadratic signature).
    // Linear would be ~4x; allow generous headroom for CI noise.
    expect(at400).toBeLessThan(at100 * 10);
  });
});
