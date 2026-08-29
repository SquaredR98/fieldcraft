import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmailField } from "../../src/components/fields/EmailField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "email",
      type: "email",
      label: "Email Address",
      required: true,
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

describe("EmailField", () => {
  it("renders label and input", () => {
    render(<EmailField {...makeProps()} />);
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
  });

  it("renders with type=email", () => {
    const { container } = render(<EmailField {...makeProps()} />);
    const input = container.querySelector('input[type="email"]');
    expect(input).toBeInTheDocument();
  });

  it("shows default placeholder when none provided", () => {
    render(<EmailField {...makeProps()} />);
    expect(screen.getByPlaceholderText("email@example.com")).toBeInTheDocument();
  });

  it("shows custom placeholder when provided", () => {
    render(
      <EmailField
        {...makeProps({
          field: {
            id: "email",
            type: "email",
            label: "Email",
            placeholder: "your@email.com",
          } as Question,
        })}
      />,
    );
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const onChange = vi.fn();
    render(<EmailField {...makeProps({ onChange })} />);

    fireEvent.change(screen.getByLabelText(/Email Address/), {
      target: { value: "test@example.com" },
    });
    expect(onChange).toHaveBeenCalledWith("test@example.com");
  });

  it("calls onBlur when input loses focus", () => {
    const onBlur = vi.fn();
    render(<EmailField {...makeProps({ onBlur })} />);

    fireEvent.blur(screen.getByLabelText(/Email Address/));
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it("sets autoComplete to email", () => {
    const { container } = render(<EmailField {...makeProps()} />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("autocomplete", "email");
  });

  it("disables input when disabled", () => {
    render(<EmailField {...makeProps({ disabled: true })} />);
    expect(screen.getByLabelText(/Email Address/)).toBeDisabled();
  });

  it("sets readOnly when readonly", () => {
    render(<EmailField {...makeProps({ readonly: true })} />);
    expect(screen.getByLabelText(/Email Address/)).toHaveAttribute("readonly");
  });

  it("displays error only when touched", () => {
    const { rerender } = render(
      <EmailField {...makeProps({ error: ["Required"], touched: false })} />,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    rerender(
      <EmailField {...makeProps({ error: ["Required"], touched: true })} />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("sets aria-invalid when touched with errors", () => {
    render(
      <EmailField {...makeProps({ error: ["Invalid email"], touched: true })} />,
    );
    expect(screen.getByLabelText(/Email Address/)).toHaveAttribute("aria-invalid", "true");
  });

  it("sets aria-required for required fields", () => {
    render(<EmailField {...makeProps()} />);
    expect(screen.getByLabelText(/Email Address/)).toHaveAttribute("aria-required", "true");
  });

  it("displays current value", () => {
    render(<EmailField {...makeProps({ value: "test@example.com" })} />);
    expect(screen.getByLabelText(/Email Address/)).toHaveValue("test@example.com");
  });

  it("shows required indicator", () => {
    render(<EmailField {...makeProps()} />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
