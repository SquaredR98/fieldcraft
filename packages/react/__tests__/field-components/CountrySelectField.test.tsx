import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CountrySelectField } from "../../src/components/fields/CountrySelectField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "country",
      type: "country_select",
      label: "Select Country",
      required: true,
      placeholder: "Choose country",
    } as Question,
    value: "US",
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

describe("CountrySelectField", () => {
  it("renders select trigger with label", () => {
    render(<CountrySelectField {...makeProps()} />);
    expect(screen.getByLabelText(/Select Country/)).toBeInTheDocument();
  });

  it("disables select trigger when disabled", () => {
    render(<CountrySelectField {...makeProps({ disabled: true })} />);
    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeDisabled();
  });
});
