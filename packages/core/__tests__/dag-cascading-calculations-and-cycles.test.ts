import { describe, it, expect } from "vitest";
import { createEngine } from "../src/engine/create-engine";
import { evaluateExpression } from "../src/engine/calculated-resolver";
import type { FormEngineSchema } from "../src/types/schema";

describe("DAG Cascading Calculations & Cycles Resilience", () => {
  describe("5-level cascading DAG calculation chain", () => {
    const schema: FormEngineSchema = {
      id: "cascading-dag-test",
      version: "1.0.0",
      title: "Cascading DAG Test",
      sections: [
        {
          id: "s1",
          title: "Calculations",
          questions: [
            { id: "baseInput", type: "number", label: "Base Input" },
            { id: "step1", type: "calculated", label: "Step 1", config: { type: "calculated", expression: "{baseInput} * 2" } },
            { id: "step2", type: "calculated", label: "Step 2", config: { type: "calculated", expression: "{step1} + 10" } },
            { id: "step3", type: "calculated", label: "Step 3", config: { type: "calculated", expression: "{step2} * 3" } },
            { id: "step4", type: "calculated", label: "Step 4", config: { type: "calculated", expression: "round({step3} / 4)" } },
            { id: "step5", type: "calculated", label: "Step 5", config: { type: "calculated", expression: "IF({step4} > 20, {step4} * 100, {step4})" } },
          ],
        },
      ],
      submitAction: { type: "callback" },
    };

    it("evaluates the full 5-level cascade synchronously on initial values", () => {
      const engine = createEngine(schema, {
        initialValues: { baseInput: 5 },
      });

      const state = engine.getState();
      // baseInput = 5
      // step1 = 5 * 2 = 10
      // step2 = 10 + 10 = 20
      // step3 = 20 * 3 = 60
      // step4 = round(60 / 4) = 15
      // step5 = IF(15 > 20, 1500, 15) = 15
      expect(state.values.step1).toBe(10);
      expect(state.values.step2).toBe(20);
      expect(state.values.step3).toBe(60);
      expect(state.values.step4).toBe(15);
      expect(state.values.step5).toBe(15);
    });

    it("reactively propagates changes through all 5 levels when base input updates", () => {
      const engine = createEngine(schema, {
        initialValues: { baseInput: 5 },
      });

      // Update baseInput to 10
      // step1 = 10 * 2 = 20
      // step2 = 20 + 10 = 30
      // step3 = 30 * 3 = 90
      // step4 = round(90 / 4) = round(22.5) = 23 (or standard round)
      // step5 = IF(23 > 20, 2300, 23) = 2300
      engine.setValue("baseInput", 10);

      const state = engine.getState();
      expect(state.values.step1).toBe(20);
      expect(state.values.step2).toBe(30);
      expect(state.values.step3).toBe(90);
      expect(state.values.step4).toBe(23);
      expect(state.values.step5).toBe(2300);
    });
  });

  describe("Circular dependency resilience", () => {
    it("handles 2-node circular dependency (A -> B -> A) without infinite loops", () => {
      const circularSchema: FormEngineSchema = {
        id: "circular-test",
        version: "1.0.0",
        title: "Circular Test",
        sections: [
          {
            id: "s1",
            title: "Section 1",
            questions: [
              { id: "nodeA", type: "calculated", label: "Node A", config: { type: "calculated", expression: "{nodeB} + 1" } },
              { id: "nodeB", type: "calculated", label: "Node B", config: { type: "calculated", expression: "{nodeA} + 1" } },
            ],
          },
        ],
        submitAction: { type: "callback" },
      };

      // Engine creation and state initialization must complete without freezing or blowing the stack
      const engine = createEngine(circularSchema, {
        initialValues: { nodeA: 1, nodeB: 1 },
      });

      expect(() => {
        engine.setValue("nodeA", 10);
      }).not.toThrow();

      const state = engine.getState();
      expect(typeof state.values.nodeA).toBe("number");
      expect(typeof state.values.nodeB).toBe("number");
    });
  });

  describe("Expression parser string & math functions", () => {
    it("evaluates string manipulation functions: CONCAT, UPPER, LOWER, TRIM", () => {
      const values = { first: "  Jane ", last: "doe" };
      const res = evaluateExpression("CONCAT(UPPER(TRIM({first})), \" \", LOWER({last}))", values);
      expect(res.value).toBe("JANE doe");
      expect(res.warning).toBeUndefined();
    });

    it("evaluates repeater aggregate functions: SUM, AVG, MIN, MAX", () => {
      const values = {
        items: [
          { score: 10 },
          { score: 20 },
          { score: 30 },
        ],
      };
      expect(evaluateExpression("SUM({items.score})", values).value).toBe(60);
      expect(evaluateExpression("AVG({items.score})", values).value).toBe(20);
      expect(evaluateExpression("MIN({items.score})", values).value).toBe(10);
      expect(evaluateExpression("MAX({items.score})", values).value).toBe(30);
    });
  });
});
