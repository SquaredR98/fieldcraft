import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SliderField } from "../../src/components/fields/SliderField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "volume",
      type: "slider",
      label: "Volume Level",
      config: {
        type: "slider",
        min: 0,
        max: 100,
        step: 5,
        minLabel: "Mute",
        maxLabel: "Max",
        showValue: true,
      },
    } as Question,
    value: 50,
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

describe("SliderField", () => {
  it("renders slider with min/max labels and current value", () => {
    render(<SliderField {...makeProps()} />);
    expect(screen.getByText("Mute")).toBeInTheDocument();
    expect(screen.getByText("Max")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });
});
