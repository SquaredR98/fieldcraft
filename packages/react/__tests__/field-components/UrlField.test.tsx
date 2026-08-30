import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UrlField } from "../../src/components/fields/UrlField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "website",
      type: "url",
      label: "Website URL",
      required: true,
      placeholder: "https://example.com",
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

describe("UrlField", () => {
  it("renders url input with label and placeholder", () => {
    render(<UrlField {...makeProps()} />);
    expect(screen.getByLabelText(/Website URL/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("https://example.com")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const onChange = vi.fn();
    render(<UrlField {...makeProps({ onChange })} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "https://squaredr.tech" },
    });
    expect(onChange).toHaveBeenCalledWith("https://squaredr.tech");
  });
});
