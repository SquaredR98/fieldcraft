import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { runBuiltInRule } from "../src/validators/built-in";
import { createNavigation } from "../src/engine/navigation";
import { createEngine } from "../src/engine/create-engine";
import { unflattenFormValues } from "../src/utils/form-utils";
import type { FormEngineSchema } from "../src/types/schema";

const store = new Map<string, string>();
const localStorageMock = {
  getItem: vi.fn((key: string) => store.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => { store.set(key, value); }),
  removeItem: vi.fn((key: string) => { store.delete(key); }),
  clear: vi.fn(() => store.clear()),
};

beforeEach(() => {
  store.clear();
  Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  // @ts-expect-error cleanup mock
  delete globalThis.localStorage;
});

describe("Core Edge Cases & Bug Validation", () => {
  it("compareToField accurately validates date strings (endDate > startDate)", () => {
    const errorWhenValid = runBuiltInRule(
      { type: "compareToField", fieldId: "startDate", operator: "gt" },
      "2026-06-15",
      { startDate: "2026-06-01" },
    );
    expect(errorWhenValid).toBeNull();

    const errorWhenInvalid = runBuiltInRule(
      { type: "compareToField", fieldId: "startDate", operator: "gt" },
      "2026-05-01",
      { startDate: "2026-06-01" },
    );
    expect(errorWhenInvalid).not.toBeNull();
  });

  it("navigation.resolveNextSectionId does not jump into a conditionally hidden section", () => {
    const schema: FormEngineSchema = {
      id: "jump-hidden-test",
      version: "1.0.0",
      title: "Jump Hidden Test",
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [{ id: "q1", type: "short_text", label: "Q1" }],
          onExit: {
            rules: [
              {
                condition: { field: "q1", operator: "eq", value: "jump" },
                jumpTo: "s2",
              },
            ],
            default: "s3",
          },
        },
        {
          id: "s2",
          title: "Section 2",
          showIf: { field: "show_s2", operator: "eq", value: true },
          questions: [{ id: "s2_q", type: "short_text", label: "S2 Q" }],
        },
        {
          id: "s3",
          title: "Section 3",
          questions: [{ id: "s3_q", type: "short_text", label: "S3 Q" }],
        },
      ],
      submitAction: { type: "callback" },
    };

    const nav = createNavigation(schema);
    // q1 is "jump", but show_s2 is false so s2 is hidden
    const nextId = nav.resolveNextSectionId("s1", { q1: "jump", show_s2: false });
    // Must not return "s2" because s2 is hidden; should fallback to default "s3"
    expect(nextId).not.toBe("s2");
    expect(nextId).toBe("s3");
  });

  it("beforeSubmit returning void/undefined does not crash submission", async () => {
    const schema: FormEngineSchema = {
      id: "before-submit-test",
      version: "1.0.0",
      title: "Before Submit Test",
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [{ id: "q1", type: "short_text", label: "Q1" }],
        },
      ],
      submitAction: { type: "callback" },
    };

    let sideEffectRan = false;
    const engine = createEngine(schema, {
      beforeSubmit: async () => {
        sideEffectRan = true;
        // Intentionally returns void/undefined
      },
    });

    engine.setValue("q1", "valid");
    const result = await engine.submit();
    expect(sideEffectRan).toBe(true);
    expect(result.success).toBe(true);
  });

  it("unflattenFormValues prevents prototype pollution", () => {
    const maliciousPayload = {
      "__proto__.polluted": "yes",
      "constructor.prototype.polluted2": "yes",
      "safe.key": "value",
    };

    const unflattened = unflattenFormValues(maliciousPayload);
    expect(unflattened).toEqual({ safe: { key: "value" } });
    expect(({} as any).polluted).toBeUndefined();
    expect(({} as any).polluted2).toBeUndefined();
  });

  it("autoSaveIntervalMs automatically starts interval save and initializes draft metadata", async () => {
    vi.useFakeTimers();
    const schema: FormEngineSchema = {
      id: "autosave-form",
      version: "1.0.0",
      title: "AutoSave Form",
      sections: [
        {
          id: "s1",
          title: "Section 1",
          questions: [{ id: "name", type: "short_text", label: "Name" }],
        },
      ],
      submitAction: { type: "callback" },
    };

    const engine = createEngine(schema, {
      sessionToken: "session-autosave",
      autoSaveIntervalMs: 1000,
    });

    engine.setValue("name", "AutoSaved User");
    // Advance timers by 1000ms to trigger auto-save
    await vi.advanceTimersByTimeAsync(1050);

    // Verify draft is restored properly by a second engine instance
    const secondEngine = createEngine(schema, {
      sessionToken: "session-autosave",
    });

    expect(secondEngine.getState().hasDraft).toBe(true);
    expect(secondEngine.getState().lastDraftSavedAt).toBeDefined();

    const loaded = await secondEngine.loadDraft();
    expect(loaded).toBe(true);
    expect(secondEngine.getState().values.name).toBe("AutoSaved User");

    engine.destroy();
    secondEngine.destroy();
    vi.useRealTimers();
  });
});
