import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PhoneField } from "../../src/components/fields/PhoneField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "phone",
      type: "phone",
      label: "Phone Number",
      required: true,
      placeholder: "+1 (555) 000-0000",
    } as Question,
    value: "",
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

describe("PhoneField", () => {
  it("renders telephone input with label and placeholder", () => {
    render(<PhoneField {...makeProps()} />);
    expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("+1 (555) 000-0000")).toBeInTheDocument();
  });

  it("calls onChange on user input", () => {
    const onChange = vi.fn();
    render(<PhoneField {...makeProps({ onChange })} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "+1 555 123 4567" },
    });
    expect(onChange).toHaveBeenCalledWith("+1 555 123 4567");
  });

  it("displays error message when touched", () => {
    render(<PhoneField {...makeProps({ error: ["Invalid phone number"], touched: true })} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid phone number");
  });
});
