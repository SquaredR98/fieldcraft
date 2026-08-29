import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RatingField } from "../../src/components/fields/RatingField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeProps(overrides?: Partial<FieldProps>): FieldProps {
  return {
    field: {
      id: "rating",
      type: "rating",
      label: "Rate this",
    } as Question,
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

describe("RatingField", () => {
  it("renders a radiogroup", () => {
    render(<RatingField {...makeProps()} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("renders 5 radio buttons by default", () => {
    render(<RatingField {...makeProps()} />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(5);
  });

  it("renders custom max from config", () => {
    render(
      <RatingField
        {...makeProps({
          field: {
            id: "rating",
            type: "rating",
            label: "Rate",
            config: { max: 10 },
          } as Question,
        })}
      />,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(10);
  });

  it("calls onChange when a star is clicked", () => {
    const onChange = vi.fn();
    render(<RatingField {...makeProps({ onChange })} />);

    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[2]); // Click 3rd star
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("sets aria-checked on the selected radio", () => {
    render(<RatingField {...makeProps({ value: 3 })} />);

    const radios = screen.getAllByRole("radio");
    expect(radios[2]).toHaveAttribute("aria-checked", "true");
    expect(radios[0]).toHaveAttribute("aria-checked", "false");
  });

  it("sets aria-label with position info", () => {
    render(<RatingField {...makeProps()} />);

    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toHaveAttribute("aria-label", "1 of 5");
    expect(radios[4]).toHaveAttribute("aria-label", "5 of 5");
  });

  it("disables all buttons when disabled", () => {
    render(<RatingField {...makeProps({ disabled: true })} />);

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it("disables all buttons when readonly", () => {
    render(<RatingField {...makeProps({ readonly: true })} />);

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it("handles ArrowRight key to increase rating", () => {
    const onChange = vi.fn();
    render(<RatingField {...makeProps({ value: 3, onChange })} />);

    const radiogroup = screen.getByRole("radiogroup");
    fireEvent.keyDown(radiogroup, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("handles ArrowLeft key to decrease rating", () => {
    const onChange = vi.fn();
    render(<RatingField {...makeProps({ value: 3, onChange })} />);

    const radiogroup = screen.getByRole("radiogroup");
    fireEvent.keyDown(radiogroup, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("ArrowRight clamps at max", () => {
    const onChange = vi.fn();
    render(<RatingField {...makeProps({ value: 5, onChange })} />);

    const radiogroup = screen.getByRole("radiogroup");
    fireEvent.keyDown(radiogroup, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("ArrowLeft clamps at 1", () => {
    const onChange = vi.fn();
    render(<RatingField {...makeProps({ value: 1, onChange })} />);

    const radiogroup = screen.getByRole("radiogroup");
    fireEvent.keyDown(radiogroup, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("Home key sets rating to 1", () => {
    const onChange = vi.fn();
    render(<RatingField {...makeProps({ value: 4, onChange })} />);

    const radiogroup = screen.getByRole("radiogroup");
    fireEvent.keyDown(radiogroup, { key: "Home" });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("End key sets rating to max", () => {
    const onChange = vi.fn();
    render(<RatingField {...makeProps({ value: 2, onChange })} />);

    const radiogroup = screen.getByRole("radiogroup");
    fireEvent.keyDown(radiogroup, { key: "End" });
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("ignores keyboard when disabled", () => {
    const onChange = vi.fn();
    render(<RatingField {...makeProps({ value: 3, disabled: true, onChange })} />);

    const radiogroup = screen.getByRole("radiogroup");
    fireEvent.keyDown(radiogroup, { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("displays error when touched", () => {
    const { rerender } = render(
      <RatingField {...makeProps({ error: ["Required"], touched: false })} />,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    rerender(
      <RatingField {...makeProps({ error: ["Required"], touched: true })} />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });
});
