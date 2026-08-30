import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { InfoBlockField } from "../../src/components/fields/InfoBlockField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "infoNote",
      type: "info_block",
      label: "Important Notice",
      helpText: "Please fill out this form carefully.",
      config: {
        type: "info_block",
        variant: "warning",
        content: "Submissions cannot be edited once sent.",
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

describe("InfoBlockField", () => {
  it("renders alert with title and content", () => {
    render(<InfoBlockField {...makeProps()} />);
    expect(screen.getByText("Important Notice")).toBeInTheDocument();
    expect(screen.getByText("Submissions cannot be edited once sent.")).toBeInTheDocument();
  });
});
