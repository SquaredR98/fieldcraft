import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RankingField } from "../../src/components/fields/RankingField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "priorities",
      type: "ranking",
      label: "Priorities",
      options: [
        { label: "Design", value: "design" },
        { label: "Performance", value: "performance" },
        { label: "Security", value: "security" },
      ],
    } as Question,
    value: ["design", "performance", "security"],
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

describe("RankingField", () => {
  it("renders ranked list items with move buttons", () => {
    render(<RankingField {...makeProps()} />);
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("moves item up when up button is clicked", () => {
    const onChange = vi.fn();
    render(<RankingField {...makeProps({ onChange })} />);

    const movePerformanceUp = screen.getByLabelText("Move Performance up");
    fireEvent.click(movePerformanceUp);

    expect(onChange).toHaveBeenCalledWith(["performance", "design", "security"]);
  });

  it("moves item down when down button is clicked", () => {
    const onChange = vi.fn();
    render(<RankingField {...makeProps({ onChange })} />);

    const moveDesignDown = screen.getByLabelText("Move Design down");
    fireEvent.click(moveDesignDown);

    expect(onChange).toHaveBeenCalledWith(["performance", "design", "security"]);
  });
});
