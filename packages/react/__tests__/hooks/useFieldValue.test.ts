import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormEngine } from "../../src/hooks/useFormEngine";
import { useFieldValue } from "../../src/hooks/useFieldValue";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

function makeSchema(): FormEngineSchema {
  return {
    id: "fv-test",
    version: "1.0.0",
    title: "Field Value Test",
    sections: [
      {
        id: "s1",
        title: "Section 1",
        questions: [
          { id: "name", type: "short_text", label: "Name" },
          { id: "age", type: "number", label: "Age" },
        ],
      },
    ],
    submitAction: { type: "callback" },
  } as FormEngineSchema;
}

describe("useFieldValue", () => {
  it("returns undefined for unset field", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      const value = useFieldValue(eng, "name");
      return { value };
    });

    expect(result.current.value).toBeUndefined();
  });

  it("returns initial value when provided", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema(), {
        initialValues: { name: "Jane" },
      });
      const value = useFieldValue(eng, "name");
      return { value };
    });

    expect(result.current.value).toBe("Jane");
  });

  it("updates when setValue is called", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      const value = useFieldValue(eng, "name");
      return { eng, value };
    });

    act(() => {
      result.current.eng.setValue("name", "Alice");
    });

    expect(result.current.value).toBe("Alice");
  });

  it("returns the correct field (not another)", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema(), {
        initialValues: { name: "Bob", age: 30 },
      });
      const nameVal = useFieldValue(eng, "name");
      const ageVal = useFieldValue(eng, "age");
      return { nameVal, ageVal };
    });

    expect(result.current.nameVal).toBe("Bob");
    expect(result.current.ageVal).toBe(30);
  });

  it("returns undefined for non-existent field ID", () => {
    const { result } = renderHook(() => {
      const eng = useFormEngine(makeSchema());
      const value = useFieldValue(eng, "doesNotExist");
      return { value };
    });

    expect(result.current.value).toBeUndefined();
  });
});
