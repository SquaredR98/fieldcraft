import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormEngine } from "../../src/hooks/useFormEngine";
import { useFieldVisibility } from "../../src/hooks/useFieldVisibility";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

function makeSchema(): FormEngineSchema {
  return {
    id: "vis-test",
    version: "1.0.0",
    title: "Visibility Test",
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

describe("useFieldVisibility", () => {
  it("field without showIf is always visible", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      return useFieldVisibility(eng, "always");
    });

    expect(result.current).toBe(true);
  });

  it("conditionally hidden field starts hidden", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      return { visible: useFieldVisibility(eng, "extra") };
    });

    expect(result.current.visible).toBe(false);
  });

  it("conditionally hidden field becomes visible when condition met", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      const visible = useFieldVisibility(eng, "extra");
      return { eng, visible };
    });

    act(() => {
      result.current.eng.setValue("toggle", true);
    });

    expect(result.current.visible).toBe(true);
  });

  it("field becomes hidden again when condition unmet", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      const visible = useFieldVisibility(eng, "extra");
      return { eng, visible };
    });

    act(() => {
      result.current.eng.setValue("toggle", true);
    });
    expect(result.current.visible).toBe(true);

    act(() => {
      result.current.eng.setValue("toggle", false);
    });
    expect(result.current.visible).toBe(false);
  });
});
