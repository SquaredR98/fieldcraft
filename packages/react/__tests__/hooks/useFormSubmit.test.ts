import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormEngine } from "../../src/hooks/useFormEngine";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

// useFormSubmit reads isSubmitting/isSubmitted/submitError from engine
// state and wraps engine.submit(). Testing through useFormEngine which
// already exposes submit() and state avoids composing two
// useSyncExternalStore hooks in the same render context.

function makeSchema(): FormEngineSchema {
  return {
    id: "fs-test",
    version: "1.0.0",
    title: "Form Submit Test",
    sections: [
      {
        id: "s1",
        title: "Section 1",
        questions: [
          { id: "name", type: "short_text", label: "Name", required: true },
        ],
      },
    ],
    submitAction: { type: "callback" },
  } as FormEngineSchema;
}

describe("useFormSubmit (via useFormEngine)", () => {
  it("initial state: not submitting, not submitted", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    expect(result.current.state.isSubmitting).toBe(false);
    expect(result.current.state.isSubmitted).toBe(false);
    expect(result.current.state.submitError).toBeUndefined();
  });

  it("successful submit sets isSubmitted to true", async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useFormEngine(makeSchema(), {
        initialValues: { name: "Jane" },
        onSubmit,
      }),
    );

    let submitResult: Awaited<ReturnType<typeof result.current.submit>>;
    await act(async () => {
      submitResult = await result.current.submit();
    });

    expect(submitResult!.success).toBe(true);
    expect(result.current.state.isSubmitted).toBe(true);
    expect(onSubmit).toHaveBeenCalled();
  });

  it("submit with validation errors returns success false", async () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    let submitResult: Awaited<ReturnType<typeof result.current.submit>>;
    await act(async () => {
      submitResult = await result.current.submit();
    });

    expect(submitResult!.success).toBe(false);
    expect(result.current.state.isSubmitted).toBe(false);
  });

  it("submit function exists on engine", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));
    expect(typeof result.current.submit).toBe("function");
  });
});
