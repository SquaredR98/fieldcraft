import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormEngine } from "../../src/hooks/useFormEngine";
import { useFormDirty } from "../../src/hooks/useFormDirty";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

function makeSchema(): FormEngineSchema {
  return {
    id: "dirty-test",
    version: "1.0.0",
    title: "Dirty Test",
    sections: [
      {
        id: "s1",
        title: "Section 1",
        questions: [
          { id: "name", type: "short_text", label: "Name" },
        ],
      },
    ],
    submitAction: { type: "callback" },
  } as FormEngineSchema;
}

describe("useFormDirty", () => {
  it("starts as not dirty", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      return useFormDirty(eng);
    });

    expect(result.current).toBe(false);
  });

  it("becomes dirty after setting a value", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      const isDirty = useFormDirty(eng);
      return { eng, isDirty };
    });

    act(() => {
      result.current.eng.setValue("name", "Jane");
    });

    expect(result.current.isDirty).toBe(true);
  });

  it("stays clean when initial values match current", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema(), {
        initialValues: { name: "Jane" },
      });
      const isDirty = useFormDirty(eng);
      return { eng, isDirty };
    });

    // Not dirty — value matches initial
    expect(result.current.isDirty).toBe(false);
  });
});
