import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NpsField } from "../../src/components/fields/NpsField";
import { cleanPreset } from "../../src/theme/presets/clean";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "nps",
      type: "nps",
      label: "How likely are you to recommend?",
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

describe("NpsField", () => {
  it("renders 11 buttons (0-10)", () => {
    render(<NpsField {...makeProps()} />);
    const buttons = screen.getAllByRole("radio");
    expect(buttons).toHaveLength(11);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("shows default labels", () => {
    render(<NpsField {...makeProps()} />);
    expect(screen.getByText("Not likely")).toBeInTheDocument();
    expect(screen.getByText("Very likely")).toBeInTheDocument();
  });

  it("uses custom labels from config", () => {
    const props = makeProps({
      field: {
        id: "nps",
        type: "nps",
        label: "NPS",
        config: { type: "nps", lowLabel: "Bad", highLabel: "Great" },
      } as Question,
    });
    render(<NpsField {...props} />);
    expect(screen.getByText("Bad")).toBeInTheDocument();
    expect(screen.getByText("Great")).toBeInTheDocument();
  });

  it("calls onChange with selected score", () => {
    const onChange = vi.fn();
    render(<NpsField {...makeProps({ onChange })} />);

    fireEvent.click(screen.getByText("9"));
    expect(onChange).toHaveBeenCalledWith(9);
  });

  it("highlights active score", () => {
    render(<NpsField {...makeProps({ value: 7 })} />);
    const btn7 = screen.getByText("7").closest("button");
    expect(btn7?.getAttribute("aria-checked")).toBe("true");
  });

  it("disables buttons when disabled", () => {
    render(<NpsField {...makeProps({ disabled: true })} />);
    const buttons = screen.getAllByRole("radio");
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it("shows error when touched", () => {
    render(
      <NpsField {...makeProps({ error: ["Required"], touched: true })} />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });
});
