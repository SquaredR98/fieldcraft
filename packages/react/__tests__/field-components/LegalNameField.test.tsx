import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LegalNameField } from "../../src/components/fields/LegalNameField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "legalName",
      type: "legal_name",
      label: "Legal Name",
      required: true,
      config: {
        type: "legal_name",
        showMiddleName: true,
        showSuffix: true,
      },
    } as Question,
    value: {},
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

describe("LegalNameField", () => {
  it("renders first, middle, last, and suffix name subfields", () => {
    render(<LegalNameField {...makeProps()} />);
    expect(screen.getByText("First name")).toBeInTheDocument();
    expect(screen.getByText("Middle name")).toBeInTheDocument();
    expect(screen.getByText("Last name")).toBeInTheDocument();
    expect(screen.getByText("Suffix")).toBeInTheDocument();
  });

  it("calls onChange when first name changes", () => {
    const onChange = vi.fn();
    render(<LegalNameField {...makeProps({ onChange, value: { last: "Doe" } })} />);

    const firstInput = screen.getByLabelText("First name");
    fireEvent.change(firstInput, { target: { value: "John" } });
    expect(onChange).toHaveBeenCalledWith({ last: "Doe", first: "John" });
  });

  it("hides middle name when showMiddleName is false", () => {
    const props = makeProps({
      field: {
        id: "legalName",
        type: "legal_name",
        label: "Legal Name",
        config: { type: "legal_name", showMiddleName: false },
      } as Question,
    });
    render(<LegalNameField {...props} />);
    expect(screen.queryByText("Middle name")).not.toBeInTheDocument();
  });
});
