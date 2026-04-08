import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormEngine } from "../../src/hooks/useFormEngine";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

function makeSchema(): FormEngineSchema {
  return {
    id: "hook-test",
    version: "1.0.0",
    title: "Hook Test",
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
          { id: "age", type: "number", label: "Age" },
        ],
      },
    ],
    submitAction: { type: "callback" },
  } as FormEngineSchema;
}

describe("useFormEngine", () => {
  it("returns reactive state", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    expect(result.current.state).toBeDefined();
    expect(result.current.state.currentSectionId).toBe("s1");
    expect(result.current.state.values).toEqual({});
  });

  it("setValue updates state reactively", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    act(() => {
      result.current.setValue("name", "Jane");
    });

    expect(result.current.state.values.name).toBe("Jane");
    expect(result.current.state.isDirty).toBe(true);
  });

  it("navigation works through hook", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    act(() => {
      result.current.nextSection();
    });

    expect(result.current.state.currentSectionId).toBe("s2");

    act(() => {
      result.current.prevSection();
    });

    expect(result.current.state.currentSectionId).toBe("s1");
  });

  it("validate returns validation result", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    let validation: ReturnType<typeof result.current.validate>;
    act(() => {
      validation = result.current.validate();
    });

    // name is required and empty
    expect(validation!.valid).toBe(false);
    expect(validation!.errors.name).toBeDefined();
  });

  it("accepts initial values", () => {
    const { result } = renderHook(() =>
      useFormEngine(makeSchema(), { initialValues: { name: "Initial" } }),
    );

    expect(result.current.state.values.name).toBe("Initial");
  });

  it("exposes getVisibleSections", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    const sections = result.current.getVisibleSections();
    expect(sections).toHaveLength(2);
  });

  it("exposes getVisibleFields", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    const fields = result.current.getVisibleFields("s1");
    expect(fields).toHaveLength(2);
  });

  it("submit with onSubmit callback", async () => {
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
    expect(onSubmit).toHaveBeenCalled();
    expect(result.current.state.isSubmitted).toBe(true);
  });

  it("destroys engine on unmount", () => {
    const { result, unmount } = renderHook(() => useFormEngine(makeSchema()));

    unmount();

    // After unmount, calling setValue should throw
    expect(() => result.current.setValue("name", "test")).toThrow("destroyed");
  });
});
