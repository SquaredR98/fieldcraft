import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFormEngine } from "../../src/hooks/useFormEngine";
import { useFormProgress } from "../../src/hooks/useFormProgress";
import { useSectionProgress } from "../../src/hooks/useSectionProgress";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

function makeSchema(): FormEngineSchema {
  return {
    id: "progress-test",
    version: "1.0.0",
    title: "Progress Test",
    sections: [
      {
        id: "s1",
        title: "Section 1",
        questions: [{ id: "q1", type: "short_text", label: "Q1" }],
      },
      {
        id: "s2",
        title: "Section 2",
        questions: [{ id: "q2", type: "short_text", label: "Q2" }],
      },
    ],
    submitAction: { type: "callback" },
  } as FormEngineSchema;
}

describe("Hook Edge Cases & Snapshot Referential Stability", () => {
  it("useFormProgress preserves object reference across re-renders when state is unchanged", () => {
    const { result, rerender } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      const progress = useFormProgress(eng);
      return progress;
    });

    const firstSnapshot = result.current;
    rerender();
    const secondSnapshot = result.current;

    expect(secondSnapshot).toBe(firstSnapshot);
  });

  it("useSectionProgress preserves object reference across re-renders when state is unchanged", () => {
    const { result, rerender } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      const progress = useSectionProgress(eng);
      return progress;
    });

    const firstSnapshot = result.current;
    rerender();
    const secondSnapshot = result.current;

    expect(secondSnapshot).toBe(firstSnapshot);
  });
});
