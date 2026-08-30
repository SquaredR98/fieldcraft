import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type React from "react";
import { FormErrorBoundary } from "../../src/components/FormErrorBoundary";

function CrashingComponent(): React.ReactNode {
  throw new Error("Simulated field crash!");
}

describe("FormErrorBoundary Component", () => {
  it("renders fallback alert message when a child component throws an unhandled error", () => {
    // Suppress console.error during expected error boundary test
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <FormErrorBoundary>
        <CrashingComponent />
      </FormErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong rendering this section.")).toBeInTheDocument();

    spy.mockRestore();
  });

  it("renders children normally when no error occurs", () => {
    render(
      <FormErrorBoundary>
        <div>Normal Field Content</div>
      </FormErrorBoundary>,
    );

    expect(screen.getByText("Normal Field Content")).toBeInTheDocument();
  });
});
