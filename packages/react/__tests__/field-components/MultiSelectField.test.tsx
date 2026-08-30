import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MultiSelectField } from "../../src/components/fields/MultiSelectField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "frameworks",
      type: "multi_select",
      label: "Frameworks",
      options: [
        { label: "React", value: "react" },
        { label: "Vue", value: "vue" },
        { label: "Svelte", value: "svelte" },
      ],
      config: {
        type: "multi_select",
        allowOther: true,
        otherLabel: "Other Framework",
      },
    } as Question,
    value: ["react"],
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

describe("MultiSelectField", () => {
  it("renders all options and selected states", () => {
    render(<MultiSelectField {...makeProps()} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.getByText("Svelte")).toBeInTheDocument();
  });

  it("toggles option when checkbox is clicked", () => {
    const onChange = vi.fn();
    render(<MultiSelectField {...makeProps({ onChange, value: ["react"] })} />);

    const vueLabel = screen.getByText("Vue");
    fireEvent.click(vueLabel);
    expect(onChange).toHaveBeenCalledWith(["react", "vue"]);
  });

  it("removes option when clicking an already selected option", () => {
    const onChange = vi.fn();
    render(<MultiSelectField {...makeProps({ onChange, value: ["react", "vue"] })} />);

    const reactLabel = screen.getByText("React");
    fireEvent.click(reactLabel);
    expect(onChange).toHaveBeenCalledWith(["vue"]);
  });
});
