import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormEngine } from "../../src/hooks/useFormEngine";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

// useFormProgress reads from engine.getState() which is the same data
// exposed by useFormEngine's `state`. Testing through useFormEngine avoids
// the infinite-loop issue of composing two useSyncExternalStore hooks
// with non-memoized object snapshots in the same render context.

function makeSchema(): FormEngineSchema {
  return {
    id: "progress-test",
    version: "1.0.0",
    title: "Progress Test",
    sections: [
      {
        id: "s1",
        title: "Section 1",
        questions: [
          { id: "name", type: "short_text", label: "Name", required: true },
        ],
      },
      {
        id: "s2",
        title: "Section 2",
        questions: [
          { id: "age", type: "number", label: "Age" },
        ],
      },
      {
        id: "s3",
        title: "Section 3",
        questions: [
          { id: "email", type: "email", label: "Email" },
        ],
      },
    ],
    submitAction: { type: "callback" },
  } as FormEngineSchema;
}

describe("useFormProgress (via useFormEngine state)", () => {
  it("starts at section index 0 with correct totals", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    expect(result.current.state.currentSectionIndex).toBe(0);
    expect(result.current.state.totalVisibleSections).toBe(3);
    expect(result.current.state.progressPercent).toBeTypeOf("number");
  });

  it("section index increments when navigating next", () => {
    const { result } = renderHook(() =>
      useFormEngine(makeSchema(), { initialValues: { name: "Jane" } }),
    );

    act(() => {
      result.current.nextSection();
    });

    expect(result.current.state.currentSectionIndex).toBe(1);
  });

  it("progress percentage increases with navigation", () => {
    const { result } = renderHook(() =>
      useFormEngine(makeSchema(), { initialValues: { name: "Jane" } }),
    );

    const initialPercent = result.current.state.progressPercent;

    act(() => {
      result.current.nextSection();
    });

    expect(result.current.state.progressPercent).toBeGreaterThan(initialPercent);
  });

  it("total reflects number of visible sections", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));
    expect(result.current.state.totalVisibleSections).toBe(3);
  });
});
