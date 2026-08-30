import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OpinionScaleField } from "../../src/components/fields/OpinionScaleField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "opinion",
      type: "opinion_scale",
      label: "How likely are you to recommend us?",
      config: {
        type: "opinion_scale",
        min: 1,
        max: 5,
        minLabel: "Not likely",
        maxLabel: "Very likely",
      },
    } as Question,
    value: 3,
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

describe("OpinionScaleField", () => {
  it("renders steps 1 to 5 with min/max labels", () => {
    render(<OpinionScaleField {...makeProps()} />);
    expect(screen.getByText("Not likely")).toBeInTheDocument();
    expect(screen.getByText("Very likely")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onChange when clicking a score step button", () => {
    const onChange = vi.fn();
    render(<OpinionScaleField {...makeProps({ onChange })} />);

    const step5 = screen.getByText("5");
    fireEvent.click(step5);
    expect(onChange).toHaveBeenCalledWith(5);
  });
});
