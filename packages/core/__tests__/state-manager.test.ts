import { describe, it, expect, vi } from "vitest";
import { createStateManager } from "../src/engine/state-manager";
import type { FormEngineSchema } from "../src/types/schema";
import { createValidatorRegistry } from "../src/validators/registry";

function makeSchema(overrides?: Partial<FormEngineSchema>): FormEngineSchema {
  return {
    id: "test",
    version: "1.0.0",
    title: "Test",
    sections: [
      {
        id: "s1",
        title: "Section 1",
        questions: [
          { id: "name", type: "short_text", label: "Name", required: true },
          { id: "email", type: "email", label: "Email" },
        ],
      },
      {
        id: "s2",
        title: "Section 2",
        questions: [
          { id: "age", type: "number", label: "Age", validation: [{ type: "min", value: 0 }] },
        ],
      },
    ],
    submitAction: { type: "callback" },
    ...overrides,
  } as FormEngineSchema;
}

describe("createStateManager", () => {
  describe("initial state", () => {
    it("initializes with the correct default state", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      const state = sm.getState();

      expect(state.values).toEqual({});
      expect(state.errors).toEqual({});
      expect(state.touched).toEqual({});
      expect(state.isDirty).toBe(false);
      expect(state.isSubmitting).toBe(false);
      expect(state.isSubmitted).toBe(false);
      expect(state.currentSectionId).toBe("s1");
      expect(state.currentSectionIndex).toBe(0);
      expect(state.canGoNext).toBe(true);
      expect(state.canGoPrev).toBe(false);
      expect(state.totalVisibleSections).toBe(2);
    });

    it("initializes with provided initial values", () => {
      const sm = createStateManager({
        schema: makeSchema(),
        initialValues: { name: "John", email: "john@example.com" },
      });
      const state = sm.getState();

      expect(state.values.name).toBe("John");
      expect(state.values.email).toBe("john@example.com");
    });
  });

  describe("setValue", () => {
    it("updates the value", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.setValue("name", "Jane");
      expect(sm.getState().values.name).toBe("Jane");
    });

    it("marks the field as touched", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.setValue("name", "Jane");
      expect(sm.getState().touched.name).toBe(true);
    });

    it("marks form as dirty", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.setValue("name", "Jane");
      expect(sm.getState().isDirty).toBe(true);
    });

    it("runs validation on the changed field", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.setValue("age", -5);
      expect(sm.getState().errors.age).toBeDefined();
      expect(sm.getState().errors.age.length).toBeGreaterThan(0);
    });

    it("clears errors when value becomes valid", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.setValue("age", -5);
      expect(sm.getState().errors.age.length).toBeGreaterThan(0);

      sm.setValue("age", 25);
      expect(sm.getState().errors.age).toEqual([]);
    });

    it("does not update if value is the same", () => {
      const listener = vi.fn();
      const sm = createStateManager({
        schema: makeSchema(),
        initialValues: { name: "John" },
      });
      sm.subscribe(listener);
      listener.mockClear();

      sm.setValue("name", "John"); // Same value
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("subscribe / notify", () => {
    it("notifies listeners on state change", () => {
      const listener = vi.fn();
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.subscribe(listener);

      sm.setValue("name", "Jane");
      expect(listener).toHaveBeenCalledOnce();
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ isDirty: true }));
    });

    it("unsubscribe stops notifications", () => {
      const listener = vi.fn();
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      const unsub = sm.subscribe(listener);

      sm.setValue("name", "Jane");
      expect(listener).toHaveBeenCalledOnce();

      unsub();
      listener.mockClear();
      sm.setValue("name", "John");
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("touchField", () => {
    it("marks field as touched", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.touchField("name");
      expect(sm.getState().touched.name).toBe(true);
    });

    it("runs validation on touch", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.touchField("name"); // Name is required, value is undefined
      expect(sm.getState().errors.name).toBeDefined();
    });
  });

  describe("clearField", () => {
    it("removes the field value", () => {
      const sm = createStateManager({
        schema: makeSchema(),
        initialValues: { name: "John" },
      });
      sm.clearField("name");
      expect(sm.getState().values.name).toBeUndefined();
    });

    it("removes errors and touched state", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.setValue("name", "J");
      sm.touchField("name");
      sm.clearField("name");
      expect(sm.getState().errors.name).toBeUndefined();
      expect(sm.getState().touched.name).toBeUndefined();
    });
  });

  describe("navigation", () => {
    it("navigates to next section", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      expect(sm.getState().currentSectionId).toBe("s1");

      const moved = sm.nextSection();
      expect(moved).toBe(true);
      expect(sm.getState().currentSectionId).toBe("s2");
    });

    it("navigates to previous section", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.nextSection();
      expect(sm.getState().currentSectionId).toBe("s2");

      const moved = sm.prevSection();
      expect(moved).toBe(true);
      expect(sm.getState().currentSectionId).toBe("s1");
    });

    it("jumpTo navigates directly", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      const jumped = sm.jumpTo("s2");
      expect(jumped).toBe(true);
      expect(sm.getState().currentSectionId).toBe("s2");
    });

    it("jumpTo returns false for non-visible section", () => {
      const schema = makeSchema({
        sections: [
          { id: "s1", title: "S1", questions: [{ id: "q1", type: "boolean", label: "Q1" }] },
          {
            id: "s2",
            title: "S2",
            showIf: { field: "q1", operator: "eq", value: true },
            questions: [{ id: "q2", type: "short_text", label: "Q2" }],
          },
        ],
      } as Partial<FormEngineSchema>);

      const sm = createStateManager({ schema, initialValues: {} });
      const jumped = sm.jumpTo("s2");
      expect(jumped).toBe(false);
    });

    it("calls onSectionChange callback", () => {
      const onSectionChange = vi.fn();
      const sm = createStateManager({
        schema: makeSchema(),
        initialValues: {},
        onSectionChange,
      });

      sm.nextSection();
      expect(onSectionChange).toHaveBeenCalledWith("s2", 1);
    });
  });

  describe("callbacks", () => {
    it("calls onFieldChange on setValue", () => {
      const onFieldChange = vi.fn();
      const sm = createStateManager({
        schema: makeSchema(),
        initialValues: {},
        onFieldChange,
      });

      sm.setValue("name", "Jane");
      expect(onFieldChange).toHaveBeenCalledWith("name", "Jane");
    });

    it("calls onStateChange on every state mutation", () => {
      const onStateChange = vi.fn();
      const sm = createStateManager({
        schema: makeSchema(),
        initialValues: {},
        onStateChange,
      });

      sm.setValue("name", "Jane");
      expect(onStateChange).toHaveBeenCalled();
    });
  });

  describe("submission state", () => {
    it("setSubmitting toggles submitting flag", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.setSubmitting(true);
      expect(sm.getState().isSubmitting).toBe(true);

      sm.setSubmitting(false);
      expect(sm.getState().isSubmitting).toBe(false);
    });

    it("setSubmitted sets submitted state", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.setSubmitted(true);
      expect(sm.getState().isSubmitted).toBe(true);
      expect(sm.getState().isSubmitting).toBe(false);
    });

    it("setSubmitted with error", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.setSubmitted(false, "Network error");
      expect(sm.getState().isSubmitted).toBe(false);
      expect(sm.getState().submitError).toBe("Network error");
    });

    it("setSubmitAttempted validates all visible fields", () => {
      const sm = createStateManager({ schema: makeSchema(), initialValues: {} });
      sm.setSubmitAttempted();
      expect(sm.getState().submitAttempted).toBe(true);
      // "name" is required and empty, so errors should exist
      expect(sm.getState().errors.name).toBeDefined();
    });
  });

  describe("calculated fields", () => {
    it("recomputes calculated fields when dependencies change", () => {
      const schema = makeSchema({
        sections: [
          {
            id: "s1",
            title: "S1",
            questions: [
              { id: "qty", type: "number", label: "Quantity" },
              { id: "price", type: "number", label: "Price" },
              {
                id: "total",
                type: "calculated",
                label: "Total",
                config: { type: "calculated", expression: "{qty} * {price}" },
              },
            ],
          },
        ],
      } as Partial<FormEngineSchema>);

      const sm = createStateManager({ schema, initialValues: { qty: 2, price: 10 } });
      // Initial calculation happens on init via setValues or recompute
      sm.setValue("qty", 3);
      expect(sm.getState().values.total).toBe(30);

      sm.setValue("price", 20);
      expect(sm.getState().values.total).toBe(60);
    });
  });

  describe("scoring", () => {
    it("computes scores for scoring fields", () => {
      const schema = makeSchema({
        sections: [
          {
            id: "s1",
            title: "S1",
            questions: [
              {
                id: "mood",
                type: "scoring",
                label: "Mood",
                config: {
                  type: "scoring",
                  options: [
                    { label: "Happy", value: "happy", score: 3 },
                    { label: "Neutral", value: "neutral", score: 2 },
                    { label: "Sad", value: "sad", score: 1 },
                  ],
                },
              },
            ],
          },
        ],
      } as Partial<FormEngineSchema>);

      const sm = createStateManager({ schema, initialValues: {} });
      sm.setValue("mood", "happy");
      expect(sm.getState().scores.mood).toBe(3);
      expect(sm.getState().totalScore).toBe(3);

      sm.setValue("mood", "sad");
      expect(sm.getState().scores.mood).toBe(1);
      expect(sm.getState().totalScore).toBe(1);
    });
  });
});
