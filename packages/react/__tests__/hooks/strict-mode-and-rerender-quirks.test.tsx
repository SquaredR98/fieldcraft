import { StrictMode } from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, renderHook, act } from "@testing-library/react";
import { useFormEngine } from "../../src/hooks/useFormEngine";
import { useFieldValue } from "../../src/hooks/useFieldValue";
import { useFieldError } from "../../src/hooks/useFieldError";
import { FormEngineRenderer } from "../../src/components/FormEngineRenderer";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

const schema: FormEngineSchema = {
  id: "quirks-test-form",
  version: "1.0.0",
  title: "Quirks Test",
  sections: [
    {
      id: "s1",
      title: "General",
      questions: [
        { id: "firstName", type: "short_text", label: "First Name", required: true },
        { id: "lastName", type: "short_text", label: "Last Name", required: true },
      ],
    },
  ],
  submitAction: { type: "callback" },
};

describe("React Quirks, Strict Mode & Re-render Stability", () => {
  it("renders seamlessly under React StrictMode (double mount/unmount cycle)", () => {
    const { unmount } = render(
      <StrictMode>
        <FormEngineRenderer schema={schema} />
      </StrictMode>,
    );

    expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();

    // Type into input in Strict Mode
    fireEvent.change(screen.getByLabelText(/First Name/), {
      target: { value: "John" },
    });

    expect(screen.getByLabelText(/First Name/)).toHaveValue("John");
    unmount();
  });

  it("useFieldValue hook syncs reactively and isolates re-renders per field", () => {
    const { result: engine } = renderHook(() => useFormEngine(schema));

    const { result: firstNameVal } = renderHook(() =>
      useFieldValue(engine.current, "firstName"),
    );
    const { result: lastNameVal } = renderHook(() =>
      useFieldValue(engine.current, "lastName"),
    );

    expect(firstNameVal.current).toBeUndefined();
    expect(lastNameVal.current).toBeUndefined();

    act(() => {
      engine.current.setValue("firstName", "Alice");
    });

    expect(firstNameVal.current).toBe("Alice");
    expect(lastNameVal.current).toBeUndefined();

    act(() => {
      engine.current.setValue("lastName", "Smith");
    });

    expect(firstNameVal.current).toBe("Alice");
    expect(lastNameVal.current).toBe("Smith");
  });

  it("useFieldError hook tracks validation errors reactively", async () => {
    const { result: engine } = renderHook(() => useFormEngine(schema));

    const { result: errors } = renderHook(() =>
      useFieldError(engine.current, "firstName"),
    );

    expect(errors.current).toBeUndefined();

    await act(async () => {
      await engine.current.submit();
    });

    expect(errors.current?.length).toBeGreaterThan(0);

    act(() => {
      engine.current.setValue("firstName", "Bob");
    });

    expect(errors.current).toBeUndefined();
  });
});
