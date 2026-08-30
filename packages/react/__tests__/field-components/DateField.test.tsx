import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DateField } from "../../src/components/fields/DateField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "birthday",
      type: "date",
      label: "Date of Birth",
      required: true,
      placeholder: "Pick a date",
      config: {
        type: "date",
        format: "yyyy-MM-dd",
      },
    } as Question,
    value: "2026-06-15",
    error: undefined,
    touched: false,
    disabled: false,
    readonly: false,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    onFocus: vi.fn(),
    theme: {},
    ...overrides,
  };
}

describe("DateField", () => {
  it("renders date trigger button with formatted date", () => {
    render(<DateField {...makeProps()} />);
    expect(screen.getByText("2026-06-15")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows placeholder when no value is provided", () => {
    render(<DateField {...makeProps({ value: "" })} />);
    expect(screen.getByText("Pick a date")).toBeInTheDocument();
  });

  it("disables date picker trigger when disabled prop is true", () => {
    render(<DateField {...makeProps({ disabled: true })} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
