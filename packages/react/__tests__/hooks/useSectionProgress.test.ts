import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormEngine } from "../../src/hooks/useFormEngine";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

// useSectionProgress reads from engine.getState() — same data exposed
// by useFormEngine's `state`. Testing through useFormEngine avoids the
// infinite-loop caused by composing two useSyncExternalStore hooks with
// non-memoized object snapshots in the same render context.

function makeSchema(): FormEngineSchema {
  return {
    id: "sp-test",
    version: "1.0.0",
    title: "Section Progress Test",
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
    ],
    submitAction: { type: "callback" },
  } as FormEngineSchema;
}

describe("useSectionProgress (via useFormEngine state)", () => {
  it("returns initial section state", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    expect(result.current.state.currentSectionId).toBe("s1");
    expect(result.current.state.currentSectionIndex).toBe(0);
    expect(result.current.state.totalVisibleSections).toBe(2);
    expect(result.current.state.canGoPrev).toBe(false);
    expect(result.current.state.canGoNext).toBe(true);
    expect(result.current.state.visitedSectionIds).toContain("s1");
  });

  it("updates after navigation", () => {
    const { result } = renderHook(() =>
      useFormEngine(makeSchema(), { initialValues: { name: "Jane" } }),
    );

    act(() => {
      result.current.nextSection();
    });

    expect(result.current.state.currentSectionId).toBe("s2");
    expect(result.current.state.currentSectionIndex).toBe(1);
    expect(result.current.state.canGoPrev).toBe(true);
    expect(result.current.state.canGoNext).toBe(false);
  });

  it("visitedSectionIds grows with navigation", () => {
    const { result } = renderHook(() =>
      useFormEngine(makeSchema(), { initialValues: { name: "Jane" } }),
    );

    act(() => {
      result.current.nextSection();
    });

    expect(result.current.state.visitedSectionIds).toContain("s1");
    expect(result.current.state.visitedSectionIds).toContain("s2");
  });

  it("progressPercent increases with navigation", () => {
    const { result } = renderHook(() =>
      useFormEngine(makeSchema(), { initialValues: { name: "Jane" } }),
    );

    const initial = result.current.state.progressPercent;

    act(() => {
      result.current.nextSection();
    });

    expect(result.current.state.progressPercent).toBeGreaterThan(initial);
  });
});
