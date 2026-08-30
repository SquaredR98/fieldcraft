import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CalculatedField } from "../../src/components/fields/CalculatedField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "totalCost",
      type: "calculated",
      label: "Total Estimated Cost",
      config: {
        type: "calculated",
        expression: "{qty} * {price}",
        prefix: "$",
        decimalPlaces: 2,
      },
    } as Question,
    value: 1250.5,
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

describe("CalculatedField", () => {
  it("renders computed value with prefix and decimal formatting", () => {
    render(<CalculatedField {...makeProps()} />);
    expect(screen.getByText("Total Estimated Cost")).toBeInTheDocument();
    expect(screen.getByText("$1250.50")).toBeInTheDocument();
  });

  it("returns null when visible is configured to false", () => {
    const { container } = render(
      <CalculatedField
        {...makeProps({
          field: {
            id: "hiddenCalc",
            type: "calculated",
            label: "Hidden Calc",
            config: { type: "calculated", expression: "1 + 1", visible: false },
          } as Question,
        })}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
