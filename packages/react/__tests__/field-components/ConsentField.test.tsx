import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConsentField } from "../../src/components/fields/ConsentField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "terms",
      type: "consent",
      label: "Terms & Conditions",
      required: true,
      config: {
        type: "consent",
        checkboxLabel: "I agree to the Terms of Service and Privacy Policy",
        expandableText: "Full terms text details here...",
      },
    } as Question,
    value: false,
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

describe("ConsentField", () => {
  it("renders checkbox with consent label and expandable trigger", () => {
    render(<ConsentField {...makeProps()} />);
    expect(screen.getByText("I agree to the Terms of Service and Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Read more")).toBeInTheDocument();
  });

  it("toggles expandable terms details", () => {
    render(<ConsentField {...makeProps()} />);
    expect(screen.queryByText("Full terms text details here...")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Read more"));
    expect(screen.getByText("Full terms text details here...")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Show less"));
    expect(screen.queryByText("Full terms text details here...")).not.toBeInTheDocument();
  });

  it("calls onChange when checking consent checkbox", () => {
    const onChange = vi.fn();
    render(<ConsentField {...makeProps({ onChange })} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
