import { describe, it, expect, vi } from "vitest";
import { createEngine } from "../src/engine/create-engine";
import type { FormEngineSchema } from "../src/types/schema";

const testSchema: FormEngineSchema = {
  id: "headless-multi-framework",
  version: "1.0.0",
  title: "Headless Form",
  sections: [
    {
      id: "sec1",
      title: "User Info",
      questions: [
        { id: "username", type: "short_text", label: "Username", required: true },
        { id: "age", type: "number", label: "Age", required: true },
        {
          id: "isAdult",
          type: "calculated",
          label: "Adult Status",
          config: {
            type: "calculated",
            expression: "IF({age} >= 18, 1, 0)",
          },
        },
      ],
    },
    {
      id: "sec2",
      title: "Confirmation",
      showIf: { field: "isAdult", operator: "eq", value: 1 },
      questions: [
        { id: "agree", type: "boolean", label: "I accept", required: true },
      ],
    },
  ],
  submitAction: { type: "callback" },
};

describe("Headless Multi-Framework Compatibility Suite (Zero UI Coupling)", () => {
  describe("Vanilla JavaScript & DOM Store Pattern", () => {
    it("drives a headless vanilla store with state transitions and listeners", () => {
      const engine = createEngine(testSchema);
      const listenerCalls: string[] = [];

      const unsubscribe = engine.subscribe((state) => {
        listenerCalls.push(`Section: ${state.currentSectionId}, Username: ${state.values.username}`);
      });

      expect(engine.getState().currentSectionId).toBe("sec1");
      expect(engine.getState().values.username).toBeUndefined();

      engine.setValue("username", "squaredr");
      expect(engine.getState().values.username).toBe("squaredr");
      expect(listenerCalls.length).toBe(1);

      unsubscribe();
      engine.setValue("username", "changed");
      // Listener should not fire after unsubscribing
      expect(listenerCalls.length).toBe(1);
    });
  });

  describe("Svelte Store Contract Integration", () => {
    it("implements Svelte readable store contract subscribe(fn)", () => {
      const engine = createEngine(testSchema);

      // Svelte readable store contract: { subscribe: (run: (value: T) => void) => () => void }
      const svelteStore = {
        subscribe(run: (state: typeof engine extends { getState(): infer S } ? S : never) => void) {
          // In Svelte, subscribers immediately receive current value upon subscription
          run(engine.getState());
          return engine.subscribe((state) => run(state));
        },
      };

      const emittedStates: unknown[] = [];
      const unsub = svelteStore.subscribe((val) => {
        emittedStates.push(val.values.age);
      });

      expect(emittedStates).toEqual([undefined]);

      engine.setValue("age", 25);
      expect(emittedStates).toEqual([undefined, 25]);
      expect(engine.getState().values.isAdult).toBe(1);

      unsub();
      engine.setValue("age", 30);
      expect(emittedStates.length).toBe(2);
    });
  });

  describe("Vue 3 Reactivity & Computed Watcher Simulation", () => {
    it("allows external reactive state managers to wrap engine cleanly", () => {
      const engine = createEngine(testSchema);

      // Simulate Vue 3 shallowRef / ref wrapper
      let vueReactiveState = engine.getState();
      const vueTriggerUpdate = vi.fn();

      engine.subscribe((newState) => {
        vueReactiveState = newState;
        vueTriggerUpdate(newState);
      });

      engine.setValue("age", 16);
      expect(vueReactiveState.values.age).toBe(16);
      expect(vueReactiveState.values.isAdult).toBe(0);
      expect(vueTriggerUpdate).toHaveBeenCalledOnce();

      // Section 2 should be conditionally hidden when isAdult is 0
      const visibleSections = engine.getVisibleSections();
      expect(visibleSections.map((s) => s.id)).toEqual(["sec1"]);

      engine.setValue("age", 21);
      expect(vueReactiveState.values.isAdult).toBe(1);
      const updatedVisibleSections = engine.getVisibleSections();
      expect(updatedVisibleSections.map((s) => s.id)).toEqual(["sec1", "sec2"]);
    });
  });

  describe("Pure Node.js & Server-Side Headless Execution", () => {
    it("runs completely without DOM, window, or document globals", async () => {
      const engine = createEngine(testSchema, {
        initialValues: { username: "server_bot", age: 20 },
      });

      expect(engine.getState().values.username).toBe("server_bot");
      expect(engine.getState().values.isAdult).toBe(1);

      const validation = engine.validate();
      // Section 1 is valid, but agree is required in section 2
      expect(validation.valid).toBe(false);
      expect(validation.errors.agree).toBeDefined();

      engine.setValue("agree", true);
      const validResult = engine.validate();
      expect(validResult.valid).toBe(true);
    });
  });
});
