import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorSummary } from "../../src/components/ErrorSummary";

describe("ErrorSummary", () => {
  it("returns null when errors object is empty", () => {
    const { container } = render(<ErrorSummary errors={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when all error arrays are empty", () => {
    const { container } = render(
      <ErrorSummary errors={{ name: [], email: [] }} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders error count for single error", () => {
    render(
      <ErrorSummary errors={{ name: ["Name is required"] }} />,
    );
    expect(screen.getByText(/1 error/)).toBeInTheDocument();
  });

  it("renders plural error count for multiple errors", () => {
    render(
      <ErrorSummary
        errors={{
          name: ["Name is required"],
          email: ["Email is required"],
        }}
      />,
    );
    expect(screen.getByText(/2 errors/)).toBeInTheDocument();
  });

  it("displays field IDs as labels when fieldLabels not provided", () => {
    render(
      <ErrorSummary errors={{ email: ["Email is required"] }} />,
    );
    expect(screen.getByText("email:")).toBeInTheDocument();
  });

  it("displays human-readable labels from fieldLabels map", () => {
    render(
      <ErrorSummary
        errors={{ email: ["Email is required"] }}
        fieldLabels={{ email: "Email Address" }}
      />,
    );
    expect(screen.getByText("Email Address:")).toBeInTheDocument();
  });

  it("displays the first error message for each field", () => {
    render(
      <ErrorSummary
        errors={{ email: ["Email is required", "Must be valid"] }}
      />,
    );
    expect(screen.getByText(/Email is required/)).toBeInTheDocument();
  });

  it("calls onFieldClick with the field ID when error is clicked", () => {
    const onFieldClick = vi.fn();
    render(
      <ErrorSummary
        errors={{ name: ["Required"] }}
        onFieldClick={onFieldClick}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onFieldClick).toHaveBeenCalledWith("name");
  });

  it("handles missing onFieldClick without crashing", () => {
    render(<ErrorSummary errors={{ name: ["Required"] }} />);
    expect(() => {
      fireEvent.click(screen.getByRole("button"));
    }).not.toThrow();
  });

  it("sets aria-label on the alert container", () => {
    render(<ErrorSummary errors={{ name: ["Required"] }} />);
    expect(screen.getByLabelText("Validation errors")).toBeInTheDocument();
  });

  it("renders multiple field errors as separate items", () => {
    render(
      <ErrorSummary
        errors={{
          name: ["Name is required"],
          email: ["Email is required"],
          age: ["Must be a number"],
        }}
      />,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });
});
