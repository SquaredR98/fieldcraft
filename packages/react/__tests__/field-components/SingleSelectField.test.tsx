import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SingleSelectField } from "../../src/components/fields/SingleSelectField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "choice",
      type: "single_select",
      label: "Select Option",
      options: [
        { label: "Zero", value: 0 },
        { label: "One", value: 1 },
        { label: "Two", value: 2 },
      ],
    } as unknown as Question,
    value: 0,
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

describe("SingleSelectField", () => {
  it("renders options and highlights numeric 0 value correctly", () => {
    render(<SingleSelectField {...makeProps({ value: 0 })} />);
    expect(screen.getByText("Zero")).toBeInTheDocument();
    expect(screen.getByText("One")).toBeInTheDocument();
  });

  it("calls onChange when an option is clicked", () => {
    const onChange = vi.fn();
    render(<SingleSelectField {...makeProps({ onChange })} />);
    const optionOne = screen.getByText("One");
    fireEvent.click(optionOne);
    expect(onChange).toHaveBeenCalledWith("1");
  });
});
