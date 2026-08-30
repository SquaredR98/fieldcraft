import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LongTextField } from "../../src/components/fields/LongTextField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "bio",
      type: "long_text",
      label: "Biography",
      required: true,
      placeholder: "Tell us about yourself",
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

describe("LongTextField", () => {
  it("renders textarea with label and placeholder", () => {
    render(<LongTextField {...makeProps()} />);
    expect(screen.getByLabelText(/Biography/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Tell us about yourself")).toBeInTheDocument();
  });

  it("calls onChange when typing in textarea", () => {
    const onChange = vi.fn();
    render(<LongTextField {...makeProps({ onChange })} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "A detailed paragraph of bio." },
    });
    expect(onChange).toHaveBeenCalledWith("A detailed paragraph of bio.");
  });

  it("calls onBlur on blur event", () => {
    const onBlur = vi.fn();
    render(<LongTextField {...makeProps({ onBlur })} />);

    fireEvent.blur(screen.getByRole("textbox"));
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it("displays error message when touched", () => {
    render(<LongTextField {...makeProps({ error: ["Bio is required"], touched: true })} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Bio is required");
  });

  it("disables textarea when disabled prop is true", () => {
    render(<LongTextField {...makeProps({ disabled: true })} />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
