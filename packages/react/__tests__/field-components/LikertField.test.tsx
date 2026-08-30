import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LikertField } from "../../src/components/fields/LikertField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "satisfaction",
      type: "likert",
      label: "Satisfaction",
      options: [
        { label: "Strongly Disagree", value: "1" },
        { label: "Disagree", value: "2" },
        { label: "Neutral", value: "3" },
        { label: "Agree", value: "4" },
        { label: "Strongly Agree", value: "5" },
      ],
    } as Question,
    value: "3",
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

describe("LikertField", () => {
  it("renders all likert options as radiogroup", () => {
    render(<LikertField {...makeProps()} />);
    expect(screen.getByText("Strongly Disagree")).toBeInTheDocument();
    expect(screen.getByText("Neutral")).toBeInTheDocument();
    expect(screen.getByText("Strongly Agree")).toBeInTheDocument();
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("calls onChange and onBlur when an option is selected", () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(<LikertField {...makeProps({ onChange, onBlur })} />);

    const optionAgree = screen.getByText("Agree");
    fireEvent.click(optionAgree);

    expect(onChange).toHaveBeenCalledWith("4");
    expect(onBlur).toHaveBeenCalledOnce();
  });
});
