import { describe, it, expect } from "vitest";
import { createEngine } from "../src/engine/create-engine";
import { extractFieldRefs } from "../src/engine/calculated-resolver";
import type { FormEngineSchema } from "../src/types/schema";

describe("Cascading & Transitive Calculated Fields", () => {
  it("multi-level linear chain: base -> doubled -> quadrupled -> plusTen", () => {
    const schema: FormEngineSchema = {
      id: "linear-chain-form",
      version: "1.0.0",
      title: "Linear Chain",
      sections: [
        {
          id: "s1",
          title: "Main",
          questions: [
            { id: "base", type: "number", label: "Base" },
            {
              id: "doubled",
              type: "calculated",
              label: "Doubled",
              config: { type: "calculated", expression: "{base} * 2" },
            },
            {
              id: "quadrupled",
              type: "calculated",
              label: "Quadrupled",
              config: { type: "calculated", expression: "{doubled} * 2" },
            },
            {
              id: "plusTen",
              type: "calculated",
              label: "Plus Ten",
              config: { type: "calculated", expression: "{quadrupled} + 10" },
            },
          ],
        },
      ],
      submitAction: { type: "callback" },
    };

    const engine = createEngine(schema, { initialValues: { base: 5 } });
    expect(engine.getState().values.doubled).toBe(10);
    expect(engine.getState().values.quadrupled).toBe(20);
    expect(engine.getState().values.plusTen).toBe(30);

    // Update base value -> should cascade all the way down
    engine.setValue("base", 10);
    expect(engine.getState().values.base).toBe(10);
    expect(engine.getState().values.doubled).toBe(20);
    expect(engine.getState().values.quadrupled).toBe(40);
    expect(engine.getState().values.plusTen).toBe(50);
  });

  it("diamond dependency graph: input -> tax, fee -> total", () => {
    const schema: FormEngineSchema = {
      id: "diamond-form",
      version: "1.0.0",
      title: "Diamond Graph",
      sections: [
        {
          id: "s1",
          title: "Main",
          questions: [
            { id: "input", type: "number", label: "Input" },
            {
              id: "tax",
              type: "calculated",
              label: "Tax",
              config: { type: "calculated", expression: "{input} * 0.1" },
            },
            {
              id: "fee",
              type: "calculated",
              label: "Fee",
              config: { type: "calculated", expression: "{input} * 0.05" },
            },
            {
              id: "total",
              type: "calculated",
              label: "Total",
              config: { type: "calculated", expression: "{input} + {tax} + {fee}" },
            },
          ],
        },
      ],
      submitAction: { type: "callback" },
    };

    const engine = createEngine(schema, { initialValues: { input: 100 } });
    expect(engine.getState().values.tax).toBe(10);
    expect(engine.getState().values.fee).toBe(5);
    expect(engine.getState().values.total).toBe(115);

    // Change input
    engine.setValue("input", 200);
    expect(engine.getState().values.tax).toBe(20);
    expect(engine.getState().values.fee).toBe(10);
    expect(engine.getState().values.total).toBe(230);
  });

  it("out-of-order declaration in schema evaluated correctly via topological sort", () => {
    const schema: FormEngineSchema = {
      id: "out-of-order-form",
      version: "1.0.0",
      title: "Out of Order",
      sections: [
        {
          id: "s1",
          title: "Main",
          questions: [
            // Declared in reverse dependency order:
            {
              id: "total",
              type: "calculated",
              label: "Total",
              config: { type: "calculated", expression: "{subtotal} + 5" },
            },
            {
              id: "subtotal",
              type: "calculated",
              label: "Subtotal",
              config: { type: "calculated", expression: "{item_price} * 2" },
            },
            { id: "item_price", type: "number", label: "Item Price" },
          ],
        },
      ],
      submitAction: { type: "callback" },
    };

    const engine = createEngine(schema, { initialValues: { item_price: 20 } });
    expect(engine.getState().values.subtotal).toBe(40);
    expect(engine.getState().values.total).toBe(45);
  });

  it("circular dependency resilience does not crash engine or cause stack overflow", () => {
    const schema: FormEngineSchema = {
      id: "circular-form",
      version: "1.0.0",
      title: "Circular",
      sections: [
        {
          id: "s1",
          title: "Main",
          questions: [
            {
              id: "field_a",
              type: "calculated",
              label: "Field A",
              config: { type: "calculated", expression: "{field_b} + 1" },
            },
            {
              id: "field_b",
              type: "calculated",
              label: "Field B",
              config: { type: "calculated", expression: "{field_a} + 1" },
            },
          ],
        },
      ],
      submitAction: { type: "callback" },
    };

    expect(() => {
      const engine = createEngine(schema, { initialValues: { field_a: 10 } });
      engine.setValue("field_a", 20);
    }).not.toThrow();
  });

  it("hyphenated field IDs extraction and calculation", () => {
    const refs = extractFieldRefs("{user-age} + {base_score} * SUM({item-list.unit-price})");
    expect(refs).toContain("user-age");
    expect(refs).toContain("base_score");
    expect(refs).toContain("item-list");

    const schema: FormEngineSchema = {
      id: "hyphenated-form",
      version: "1.0.0",
      title: "Hyphenated IDs",
      sections: [
        {
          id: "s1",
          title: "Main",
          questions: [
            { id: "user-age", type: "number", label: "Age" },
            {
              id: "calculated-target-age",
              type: "calculated",
              label: "Target Age",
              config: { type: "calculated", expression: "{user-age} + 5" },
            },
            {
              id: "final-metric",
              type: "calculated",
              label: "Final Metric",
              config: { type: "calculated", expression: "{calculated-target-age} * 2" },
            },
          ],
        },
      ],
      submitAction: { type: "callback" },
    };

    const engine = createEngine(schema, { initialValues: { "user-age": 20 } });
    expect(engine.getState().values["calculated-target-age"]).toBe(25);
    expect(engine.getState().values["final-metric"]).toBe(50);

    engine.setValue("user-age", 30);
    expect(engine.getState().values["calculated-target-age"]).toBe(35);
    expect(engine.getState().values["final-metric"]).toBe(70);
  });
});
