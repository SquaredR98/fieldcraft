import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimeField } from "../../src/components/fields/TimeField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "meetingTime",
      type: "time",
      label: "Meeting Time",
      required: true,
      placeholder: "Select time",
      config: {
        type: "time",
        minuteStep: 30,
        format: "12h",
      },
    } as Question,
    value: "14:30",
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

describe("TimeField", () => {
  it("renders select trigger with clock icon and label", () => {
    render(<TimeField {...makeProps()} />);
    expect(screen.getByLabelText(/Meeting Time/)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("disables time select trigger when disabled prop is true", () => {
    render(<TimeField {...makeProps({ disabled: true })} />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
