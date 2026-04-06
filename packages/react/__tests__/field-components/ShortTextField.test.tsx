import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ShortTextField } from "../../src/components/fields/ShortTextField";
import { cleanPreset } from "../../src/theme/presets/clean";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/formengine-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "name",
      type: "short_text",
      label: "Full Name",
      required: true,
      placeholder: "Enter your name",
    } as Question,
    value: "",
    error: undefined,
    touched: false,
    disabled: false,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    theme: cleanPreset,
    ...overrides,
  };
}

describe("ShortTextField", () => {
  it("renders label and input", () => {
    render(<ShortTextField {...makeProps()} />);
    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("shows required indicator", () => {
    render(<ShortTextField {...makeProps()} />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const onChange = vi.fn();
    render(<ShortTextField {...makeProps({ onChange })} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Jane" },
    });
    expect(onChange).toHaveBeenCalledWith("Jane");
  });

  it("calls onBlur when input loses focus", () => {
    const onBlur = vi.fn();
    render(<ShortTextField {...makeProps({ onBlur })} />);

    fireEvent.blur(screen.getByRole("textbox"));
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it("displays error only when touched", () => {
    const { rerender } = render(
      <ShortTextField {...makeProps({ error: ["Required"], touched: false })} />,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    rerender(
      <ShortTextField {...makeProps({ error: ["Required"], touched: true })} />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("disables input when disabled prop is true", () => {
    render(<ShortTextField {...makeProps({ disabled: true })} />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("sets aria-invalid when touched with errors", () => {
    render(
      <ShortTextField
        {...makeProps({ error: ["Required"], touched: true })}
      />,
    );
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("sets aria-required for required fields", () => {
    render(<ShortTextField {...makeProps()} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-required", "true");
  });

  it("shows help text when provided", () => {
    const props = makeProps({
      field: {
        id: "name",
        type: "short_text",
        label: "Name",
        helpText: "Enter your full legal name",
      } as Question,
    });
    render(<ShortTextField {...props} />);
    expect(screen.getByText("Enter your full legal name")).toBeInTheDocument();
  });

  it("displays the current value", () => {
    render(<ShortTextField {...makeProps({ value: "Jane Doe" })} />);
    expect(screen.getByRole("textbox")).toHaveValue("Jane Doe");
  });
});
