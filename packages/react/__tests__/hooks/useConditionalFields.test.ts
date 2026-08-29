import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormEngine } from "../../src/hooks/useFormEngine";
import { useConditionalFields } from "../../src/hooks/useConditionalFields";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

function makeSchema(): FormEngineSchema {
  return {
    id: "cf-test",
    version: "1.0.0",
    title: "Conditional Fields Test",
    sections: [
      {
        id: "s1",
        title: "Section 1",
        questions: [
          { id: "toggle", type: "boolean", label: "Show extra?" },
          {
            id: "extra",
            type: "short_text",
            label: "Extra",
            showIf: {
              field: "toggle",
              operator: "eq",
              value: true,
            },
          },
          { id: "always", type: "short_text", label: "Always Visible" },
        ],
      },
    ],
    submitAction: { type: "callback" },
  } as FormEngineSchema;
}

describe("useConditionalFields", () => {
  it("returns visibility map for all fields", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      return useConditionalFields(eng);
    });

    expect(result.current).toHaveProperty("toggle");
    expect(result.current).toHaveProperty("extra");
    expect(result.current).toHaveProperty("always");
  });

  it("unconditional fields are visible", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      return useConditionalFields(eng);
    });

    expect(result.current.toggle).toBe(true);
    expect(result.current.always).toBe(true);
  });

  it("conditional field starts hidden", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      return useConditionalFields(eng);
    });

    expect(result.current.extra).toBe(false);
  });

  it("conditional field becomes visible when condition met", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      const visibility = useConditionalFields(eng);
      return { eng, visibility };
    });

    act(() => {
      result.current.eng.setValue("toggle", true);
    });

    expect(result.current.visibility.extra).toBe(true);
  });

  it("maintains referential stability when values don't change", () => {
    const { result, rerender } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      return useConditionalFields(eng);
    });

    const first = result.current;
    rerender();
    // Should be same reference since visibility didn't change
    expect(result.current).toBe(first);
  });
});
