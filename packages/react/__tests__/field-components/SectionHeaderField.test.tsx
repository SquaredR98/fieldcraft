import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeaderField } from "../../src/components/fields/SectionHeaderField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "secHeader",
      type: "section_header",
      label: "Personal Information",
      helpText: "Enter your contact and identity details",
      config: {
        type: "section_header",
        level: "h2",
        showDivider: true,
      },
    } as Question,
    value: undefined,
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

describe("SectionHeaderField", () => {
  it("renders heading and subtitle", () => {
    render(<SectionHeaderField {...makeProps()} />);
    expect(screen.getByRole("heading", { level: 2, name: "Personal Information" })).toBeInTheDocument();
    expect(screen.getByText("Enter your contact and identity details")).toBeInTheDocument();
  });
});
