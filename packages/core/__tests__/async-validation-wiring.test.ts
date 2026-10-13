import { describe, it, expect, vi } from "vitest";
import { createEngine } from "../src/engine/create-engine";
import type { FormEngineSchema } from "../src/types/schema";

/**
 * `REACT-12` — async validators are actually invoked.
 *
 * Before this, `validateFieldAsync()` was written, exported from its module,
 * and unit-tested — but nothing in production code ever called it. A schema
 * with `{ type: "async" }` validated as if the rule were absent, so
 * "is this username taken" silently passed.
 *
 * A passing test suite made that HARDER to spot: the old test called
 * `validateFieldAsync` directly and proved the function works. Nothing proved
 * anything used it. These tests assert the wiring, not the function.
 */

function schemaWithAsync(): FormEngineSchema {
  return {
    id: "async-wiring",
    version: "1.0.0",
    submitAction: { type: "callback" },
    title: "Async wiring",
    settings: { displayMode: "classic" },
    sections: [
      {
        id: "s1",
        title: "Account",
        questions: [
          {
            id: "username",
            type: "short_text",
            label: "Username",
            validation: [{ type: "async", endpoint: "uniqueUsername" }],
          },
        ],
      },
    ],
  };
}

const taken = async (v: unknown) => (v === "taken" ? "Already taken" : null);

describe("REACT-12 — submit gate", () => {
  it("invokes the async validator at all", async () => {
    const spy = vi.fn(taken);
    const engine = createEngine(schemaWithAsync(), {
      asyncValidators: { uniqueUsername: spy },
    });

    engine.setValue("username", "free");
    await engine.submit();

    expect(spy).toHaveBeenCalled();
  });

  it("blocks submission when the async validator rejects the value", async () => {
    const engine = createEngine(schemaWithAsync(), {
      asyncValidators: { uniqueUsername: taken },
    });

    engine.setValue("username", "taken");
    const result = await engine.submit();

    expect(result.success).toBe(false);
    expect(engine.getFieldError("username")).toEqual(["Already taken"]);
  });

  it("allows submission when the value passes", async () => {
    const engine = createEngine(schemaWithAsync(), {
      asyncValidators: { uniqueUsername: taken },
    });

    engine.setValue("username", "free");
    const result = await engine.submit();

    expect(result.success).toBe(true);
  });

  it("runs even for a field the respondent never blurred", async () => {
    // The gate cannot rely on blur: a value can be prefilled, or set
    // programmatically, and never touched.
    const spy = vi.fn(taken);
    const engine = createEngine(schemaWithAsync(), {
      initialValues: { username: "taken" },
      asyncValidators: { uniqueUsername: spy },
    });

    const result = await engine.submit();

    expect(spy).toHaveBeenCalled();
    expect(result.success).toBe(false);
  });
});

describe("REACT-12 — blur path", () => {
  it("runs the async validator on blur and surfaces the error", async () => {
    const engine = createEngine(schemaWithAsync(), {
      asyncValidators: { uniqueUsername: taken },
    });

    engine.setValue("username", "taken");
    engine.touchField("username");
    await vi.waitFor(() =>
      expect(engine.getFieldError("username")).toEqual(["Already taken"]),
    );
  });

  it("exposes a pending state while the check is in flight", async () => {
    let release: (() => void) | undefined;
    const engine = createEngine(schemaWithAsync(), {
      asyncValidators: {
        uniqueUsername: () =>
          new Promise<string | null>((resolve) => {
            release = () => resolve(null);
          }),
      },
    });

    engine.setValue("username", "x");
    engine.touchField("username");

    // Neither valid nor invalid: the answer is not known yet.
    expect(engine.getState().validating.username).toBe(true);

    release?.();
    await vi.waitFor(() =>
      expect(engine.getState().validating.username).toBeUndefined(),
    );
  });

  it("re-validates on every blur, not just the first", async () => {
    // `touchField` used to return early once a field was touched, so a field
    // validated on first blur and never again — wrong for async rules, since
    // the value may have changed since.
    const spy = vi.fn(taken);
    const engine = createEngine(schemaWithAsync(), {
      asyncValidators: { uniqueUsername: spy },
    });

    engine.setValue("username", "a");
    engine.touchField("username");
    await vi.waitFor(() => expect(spy).toHaveBeenCalledTimes(1));

    engine.setValue("username", "b");
    engine.touchField("username");
    await vi.waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
  });

  it("does not call the server when synchronous rules already failed", async () => {
    const spy = vi.fn(taken);
    const schema = schemaWithAsync();
    schema.sections[0].questions[0].validation = [
      { type: "minLength", value: 5 },
      { type: "async", endpoint: "uniqueUsername" },
    ];
    const engine = createEngine(schema, {
      asyncValidators: { uniqueUsername: spy },
    });

    engine.setValue("username", "ab"); // too short
    engine.touchField("username");

    await new Promise((r) => setTimeout(r, 20));
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("REACT-12 — failure handling (option C)", () => {
  it("fails OPEN on blur: a thrown validator does not mark the field invalid", async () => {
    // Blur is a convenience. An unreachable endpoint should not nag the
    // respondent about something they cannot fix.
    const engine = createEngine(schemaWithAsync(), {
      asyncValidators: {
        uniqueUsername: async () => {
          throw new Error("ECONNREFUSED");
        },
      },
    });

    engine.setValue("username", "x");
    engine.touchField("username");

    await new Promise((r) => setTimeout(r, 20));
    expect(engine.getFieldError("username") ?? []).toEqual([]);
    expect(engine.getState().validating.username).toBeUndefined();
  });

  it("fails CLOSED on submit: a thrown validator blocks the submission", async () => {
    // Submit is the gate. An unverified claim must not pass silently — that is
    // the bug this whole item exists to remove.
    const engine = createEngine(schemaWithAsync(), {
      asyncValidators: {
        uniqueUsername: async () => {
          throw new Error("ECONNREFUSED");
        },
      },
    });

    engine.setValue("username", "x");
    const result = await engine.submit();

    expect(result.success).toBe(false);
    // Generic on purpose: raw endpoint text reaches the consumer through
    // onSubmitError, never the respondent.
    expect(result.adapterResults[0].error).not.toContain("ECONNREFUSED");
  });
});

describe("REACT-12 — no async rules", () => {
  it("does not change behaviour for schemas without async validators", async () => {
    const schema = schemaWithAsync();
    schema.sections[0].questions[0].validation = [{ type: "required" }];
    const engine = createEngine(schema, {});

    engine.setValue("username", "anything");
    const result = await engine.submit();

    expect(result.success).toBe(true);
  });
});

describe("REACT-12 — navigation is blocked while a check is open", () => {
  function stepped(): FormEngineSchema {
    return {
      id: "stepped-async",
      version: "1.0.0",
      submitAction: { type: "callback" },
      title: "Stepped",
      settings: { displayMode: "stepped" },
      sections: [
        {
          id: "s1",
          title: "One",
          questions: [
            {
              id: "username",
              type: "short_text",
              label: "Username",
              validation: [{ type: "async", endpoint: "uniqueUsername" }],
            },
          ],
        },
        {
          id: "s2",
          title: "Two",
          questions: [{ id: "other", type: "short_text", label: "Other" }],
        },
      ],
    };
  }

  it("refuses to advance a section while that section is validating", async () => {
    // Otherwise the respondent advances, and the error lands on a field they
    // can no longer see — the check ran and told nobody.
    let release: (() => void) | undefined;
    const engine = createEngine(stepped(), {
      asyncValidators: {
        uniqueUsername: () =>
          new Promise<string | null>((r) => {
            release = () => r(null);
          }),
      },
    });

    engine.setValue("username", "v");
    engine.touchField("username");
    expect(engine.getState().validating.username).toBe(true);

    engine.nextSection();
    expect(engine.getState().currentSectionId).toBe("s1");

    release?.();
    await vi.waitFor(() =>
      expect(engine.getState().validating.username).toBeUndefined(),
    );

    engine.nextSection();
    expect(engine.getState().currentSectionId).toBe("s2");
  });
});

describe("REACT-12 — no duplicate requests", () => {
  it("reuses a blur result instead of re-asking on submit", async () => {
    const spy = vi.fn(taken);
    const engine = createEngine(schemaWithAsync(), {
      asyncValidators: { uniqueUsername: spy },
    });

    engine.setValue("username", "free");
    engine.touchField("username");
    await vi.waitFor(() => expect(spy).toHaveBeenCalledTimes(1));

    await engine.submit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("re-checks when the value changed after the blur check", async () => {
    // The cache is keyed by value, so an edit must invalidate it — otherwise
    // a stale pass would let a rejected value through.
    const seen: unknown[] = [];
    const engine = createEngine(schemaWithAsync(), {
      asyncValidators: {
        uniqueUsername: async (v) => {
          seen.push(v);
          return v === "taken" ? "Already taken" : null;
        },
      },
    });

    engine.setValue("username", "free");
    engine.touchField("username");
    await vi.waitFor(() => expect(seen).toContain("free"));

    engine.setValue("username", "taken");
    const result = await engine.submit();

    expect(seen).toContain("taken");
    expect(result.success).toBe(false);
  });
});
