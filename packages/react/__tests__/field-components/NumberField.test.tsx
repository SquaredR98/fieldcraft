import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NumberField } from "../../src/components/fields/NumberField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "qty",
      type: "number",
      label: "Quantity",
      placeholder: "Enter a number",
    } as Question,
    value: undefined,
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

describe("NumberField", () => {
  it("renders label and input", () => {
    render(<NumberField {...makeProps()} />);
    expect(screen.getByLabelText(/Quantity/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter a number")).toBeInTheDocument();
  });

  it("renders with type=number", () => {
    render(<NumberField {...makeProps()} />);
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("calls onChange with number when typing", () => {
    const onChange = vi.fn();
    render(<NumberField {...makeProps({ onChange })} />);

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "42" },
    });
    expect(onChange).toHaveBeenCalledWith(42);
  });

  it("calls onChange with undefined when input cleared", () => {
    const onChange = vi.fn();
    render(<NumberField {...makeProps({ onChange, value: 10 })} />);

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "" },
    });
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it("calls onBlur when input loses focus", () => {
    const onBlur = vi.fn();
    render(<NumberField {...makeProps({ onBlur })} />);

    fireEvent.blur(screen.getByRole("spinbutton"));
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it("rounds to decimalPlaces on blur", () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(
      <NumberField
        {...makeProps({
          value: 3.14159,
          onChange,
          onBlur,
          field: {
            id: "price",
            type: "number",
            label: "Price",
            config: { decimalPlaces: 2 },
          } as Question,
        })}
      />,
    );

    fireEvent.blur(screen.getByRole("spinbutton"));
    expect(onChange).toHaveBeenCalledWith(3.14);
    expect(onBlur).toHaveBeenCalled();
  });

  it("does not round on blur when decimalPlaces not set", () => {
    const onChange = vi.fn();
    render(<NumberField {...makeProps({ value: 3.14159, onChange })} />);

    fireEvent.blur(screen.getByRole("spinbutton"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("displays prefix", () => {
    render(
      <NumberField
        {...makeProps({
          field: {
            id: "price",
            type: "number",
            label: "Price",
            config: { prefix: "$" },
          } as Question,
        })}
      />,
    );
    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("displays suffix", () => {
    render(
      <NumberField
        {...makeProps({
          field: {
            id: "weight",
            type: "number",
            label: "Weight",
            config: { suffix: "kg" },
          } as Question,
        })}
      />,
    );
    expect(screen.getByText("kg")).toBeInTheDocument();
  });

  it("disables input when disabled", () => {
    render(<NumberField {...makeProps({ disabled: true })} />);
    expect(screen.getByRole("spinbutton")).toBeDisabled();
  });

  it("sets readOnly when readonly", () => {
    render(<NumberField {...makeProps({ readonly: true })} />);
    expect(screen.getByRole("spinbutton")).toHaveAttribute("readonly");
  });

  it("displays error only when touched", () => {
    const { rerender } = render(
      <NumberField {...makeProps({ error: ["Required"], touched: false })} />,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    rerender(
      <NumberField {...makeProps({ error: ["Required"], touched: true })} />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("sets aria-invalid when touched with errors", () => {
    render(
      <NumberField {...makeProps({ error: ["Required"], touched: true })} />,
    );
    expect(screen.getByRole("spinbutton")).toHaveAttribute("aria-invalid", "true");
  });

  it("displays current value", () => {
    render(<NumberField {...makeProps({ value: 42 })} />);
    expect(screen.getByRole("spinbutton")).toHaveValue(42);
  });

  it("sets min/max/step from config", () => {
    render(
      <NumberField
        {...makeProps({
          field: {
            id: "score",
            type: "number",
            label: "Score",
            config: { min: 0, max: 100, step: 5 },
          } as Question,
        })}
      />,
    );
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "100");
    expect(input).toHaveAttribute("step", "5");
  });
});
