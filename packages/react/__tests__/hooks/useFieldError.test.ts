import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormEngine } from "../../src/hooks/useFormEngine";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

// validate() returns a ValidationResult but does NOT update state.errors.
// state.errors is updated when submit is attempted (setSubmitAttempted).
// These tests verify both: validate() return value and state.errors after submit.

function makeSchema(): FormEngineSchema {
  return {
    id: "fe-test",
    version: "1.0.0",
    title: "Field Error Test",
    sections: [
      {
        id: "s1",
        title: "Section 1",
        questions: [
          { id: "email", type: "email", label: "Email", required: true },
          { id: "name", type: "short_text", label: "Name" },
        ],
      },
    ],
    submitAction: { type: "callback" },
  } as FormEngineSchema;
}

describe("useFieldError (via useFormEngine)", () => {
  it("state.errors is empty before any validation", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    expect(result.current.state.errors.email).toBeUndefined();
  });

  it("validate() returns errors for required empty field", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    let validation: ReturnType<typeof result.current.validate>;
    act(() => {
      validation = result.current.validate();
    });

    expect(validation!.valid).toBe(false);
    expect(validation!.errors.email).toBeDefined();
    expect(validation!.errors.email.length).toBeGreaterThan(0);
  });

  it("validate() returns no errors for non-required field without value", () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    let validation: ReturnType<typeof result.current.validate>;
    act(() => {
      validation = result.current.validate();
    });

    const nameErrors = validation!.errors.name;
    expect(!nameErrors || nameErrors.length === 0).toBe(true);
  });

  it("state.errors populated after failed submit attempt", async () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    await act(async () => {
      await result.current.submit();
    });

    // Submit triggers setSubmitAttempted which updates state.errors
    const emailErrors = result.current.state.errors.email;
    expect(emailErrors).toBeDefined();
    expect(emailErrors!.length).toBeGreaterThan(0);
  });

  it("getFieldError returns errors after submit attempt", async () => {
    const { result } = renderHook(() => useFormEngine(makeSchema()));

    await act(async () => {
      await result.current.submit();
    });

    const emailErrors = result.current.getFieldError("email");
    expect(emailErrors).toBeDefined();
    expect(emailErrors!.length).toBeGreaterThan(0);

    const nameErrors = result.current.getFieldError("name");
    expect(!nameErrors || nameErrors.length === 0).toBe(true);
  });

  it("errors clear when valid value set and re-submitted", async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useFormEngine(makeSchema(), { onSubmit }),
    );

    // First submit — fails
    await act(async () => {
      await result.current.submit();
    });
    expect(result.current.state.errors.email).toBeDefined();

    // Set valid value and submit again
    act(() => {
      result.current.setValue("email", "test@example.com");
    });
    await act(async () => {
      await result.current.submit();
    });

    const emailErrors = result.current.state.errors.email;
    expect(!emailErrors || emailErrors.length === 0).toBe(true);
  });
});
