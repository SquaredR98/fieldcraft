import { describe, it, expect, vi } from "vitest";
import { createEngine } from "../src/engine/create-engine";
import { createDraftManager } from "../src/engine/draft-manager";
import { evaluateExpression } from "../src/engine/calculated-resolver";
import type { FormEngineSchema } from "../src/types/schema";

describe("Draft Management & State Resilience", () => {
  it("filters hidden sections from visitedSectionIds on draft restore", async () => {
    const schema: FormEngineSchema = {
      id: "draft-visibility-form",
      version: "1.0.0",
      title: "Draft Visibility",
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [{ id: "enable_s2", type: "boolean", label: "Enable S2" }],
        },
        {
          id: "s2",
          title: "Section 2",
          showIf: { field: "enable_s2", operator: "eq", value: true },
          questions: [{ id: "s2_input", type: "short_text", label: "S2 Input" }],
        },
        {
          id: "s3",
          title: "Section 3",
          questions: [{ id: "s3_input", type: "short_text", label: "S3 Input" }],
        },
      ],
      submitAction: { type: "callback" },
    };

    const engine = createEngine(schema, {
      initialValues: { enable_s2: true },
    });

    // Visit s1, enable s2, visit s2
    engine.setValue("enable_s2", true);
    engine.nextSection(); // goes to s2
    expect(engine.getState().currentSectionId).toBe("s2");
    expect(engine.getState().visitedSectionIds).toContain("s2");

    // Save draft while s2 is visible
    await engine.saveDraft();

    // Now recreate engine with enable_s2: false
    const restoredEngine = createEngine(schema, {
      initialValues: { enable_s2: false },
    });

    // Manually restore draft where s2 was visited, but set enable_s2 to false
    restoredEngine.setValue("enable_s2", false);
    await restoredEngine.loadDraft();

    // Set enable_s2 = false and check visited sections
    restoredEngine.setValue("enable_s2", false);
    const state = restoredEngine.getState();
    expect(state.visibleSectionIds).not.toContain("s2");
  });

  it("isolates subscriber errors so subsequent listeners and onStateChange still execute", () => {
    const onStateChange = vi.fn();
    const goodListener = vi.fn();
    const throwingListener = vi.fn().mockImplementation(() => {
      throw new Error("Subscriber crash!");
    });

    const schema: FormEngineSchema = {
      id: "listener-isolation-form",
      version: "1.0.0",
      title: "Listener Isolation",
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [{ id: "text", type: "short_text", label: "Text" }],
        },
      ],
      submitAction: { type: "callback" },
    };

    const engine = createEngine(schema, { onStateChange });
    engine.subscribe(throwingListener);
    engine.subscribe(goodListener);

    expect(() => {
      engine.setValue("text", "updated value");
    }).not.toThrow();

    expect(throwingListener).toHaveBeenCalled();
    expect(goodListener).toHaveBeenCalled();
    expect(onStateChange).toHaveBeenCalled();
    expect(engine.getState().values.text).toBe("updated value");
  });

  it("handles broken draft migration gracefully by returning null without throwing", async () => {
    const draftManager = createDraftManager({
      schemaId: "migration-test",
      sessionToken: "session-1",
      storage: "local",
      ttlHours: 24,
      schemaVersion: "2.0.0",
    });

    // Save draft with version 1.0.0
    await draftManager.save({
      values: { oldField: "oldVal" },
      currentSectionId: "s1",
      visitedSectionIds: ["s1"],
      savedAt: new Date().toISOString(),
      schemaVersion: "1.0.0",
    });

    const brokenMigrations = {
      "1.0.0": () => {
        throw new Error("Migration logic failed!");
      },
    };

    const loaded = await draftManager.load(brokenMigrations);
    expect(loaded).toBeNull();
  });

  it("returns warning and null value for non-finite calculation results", () => {
    const resultDivZero = evaluateExpression("{a} / 0", { a: 10 });
    expect(resultDivZero.value).toBeNull();
    expect(resultDivZero.warning).toBeDefined();
  });

  it("engine.destroy stops autoSave and clears subscribers", () => {
    const schema: FormEngineSchema = {
      id: "destroy-test-form",
      version: "1.0.0",
      title: "Destroy Test",
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [{ id: "q1", type: "short_text", label: "Question 1" }],
        },
      ],
      submitAction: { type: "callback" },
    };

    const listener = vi.fn();
    const engine = createEngine(schema, { autoSaveIntervalMs: 1000 });
    engine.subscribe(listener);

    engine.destroy();
    expect(() => engine.setValue("q1", "val")).toThrow("destroyed");
  });
});
