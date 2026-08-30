import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { DividerField } from "../../src/components/fields/DividerField";
import { SpacerField } from "../../src/components/fields/SpacerField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(type: "divider" | "spacer"): FieldProps {
  return {
    field: {
      id: "div1",
      type,
      label: "Separator",
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
  };
}

describe("Structural Layout Fields: DividerField & SpacerField", () => {
  it("renders DividerField container element", () => {
    const { container } = render(<DividerField {...makeProps("divider")} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders SpacerField container element", () => {
    const { container } = render(<SpacerField {...makeProps("spacer")} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
