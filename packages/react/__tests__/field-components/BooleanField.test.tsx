import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BooleanField } from "../../src/components/fields/BooleanField";
import { cleanPreset } from "../../src/theme/presets/clean";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "agree",
      type: "boolean",
      label: "Do you agree?",
    } as Question,
    value: undefined,
    error: undefined,
    touched: false,
    disabled: false,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    theme: cleanPreset,
    ...overrides,
  };
}

describe("BooleanField", () => {
  it("renders Yes/No buttons by default", () => {
    render(<BooleanField {...makeProps()} />);
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("uses field.options when provided", () => {
    const props = makeProps({
      field: {
        id: "agree",
        type: "boolean",
        label: "Do you agree?",
        options: [
          { label: "Absolutely", value: true },
          { label: "Nope", value: false },
        ],
      } as Question,
    });
    render(<BooleanField {...props} />);
    expect(screen.getByText("Absolutely")).toBeInTheDocument();
    expect(screen.getByText("Nope")).toBeInTheDocument();
  });

  it("calls onChange with true when Yes is clicked", () => {
    const onChange = vi.fn();
    render(<BooleanField {...makeProps({ onChange })} />);

    fireEvent.click(screen.getByText("Yes"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange with false when No is clicked", () => {
    const onChange = vi.fn();
    render(<BooleanField {...makeProps({ onChange })} />);

    fireEvent.click(screen.getByText("No"));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("highlights the active selection", () => {
    render(<BooleanField {...makeProps({ value: true })} />);
    const yesBtn = screen.getByText("Yes").closest("button");
    expect(yesBtn?.getAttribute("aria-checked")).toBe("true");
  });

  it("disables buttons when disabled", () => {
    render(<BooleanField {...makeProps({ disabled: true })} />);
    const buttons = screen.getAllByRole("radio");
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it("shows error when touched", () => {
    render(
      <BooleanField {...makeProps({ error: ["Required"], touched: true })} />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });
});
