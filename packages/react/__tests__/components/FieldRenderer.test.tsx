import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FieldRenderer } from "../../src/components/FieldRenderer";
import type { Question } from "@squaredr/fieldcraft-core";
import type { FieldRegistry, FieldProps } from "../../src/registry/field-registry";

const MockComponent = (props: FieldProps) => (
  <div data-testid="mock-field">{props.field.label}</div>
);

function makeProps(overrides?: Partial<Parameters<typeof FieldRenderer>[0]>) {
  return {
    field: {
      id: "name",
      type: "short_text",
      label: "Full Name",
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
    registry: { short_text: MockComponent } as FieldRegistry,
    ...overrides,
  };
}

describe("FieldRenderer", () => {
  it("renders the registered component for the field type", () => {
    render(<FieldRenderer {...makeProps()} />);
    expect(screen.getByTestId("mock-field")).toHaveTextContent("Full Name");
  });

  it("shows error alert for unsupported field type", () => {
    render(
      <FieldRenderer
        {...makeProps({
          field: { id: "x", type: "unknown_type" as any, label: "X" } as Question,
          registry: {},
        })}
      />,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Unsupported field type/)).toBeInTheDocument();
    expect(screen.getByText("unknown_type")).toBeInTheDocument();
  });

  it("sets data-field-id attribute on wrapper", () => {
    const { container } = render(<FieldRenderer {...makeProps()} />);
    expect(container.querySelector('[data-field-id="name"]')).toBeInTheDocument();
  });

  it("applies w-full by default", () => {
    const { container } = render(<FieldRenderer {...makeProps()} />);
    const wrapper = container.querySelector('[data-field-id="name"]');
    expect(wrapper?.className).toContain("w-full");
  });

  it("applies w-1/2 for half width layout", () => {
    const { container } = render(
      <FieldRenderer
        {...makeProps({
          field: {
            id: "name",
            type: "short_text",
            label: "Name",
            layout: { width: "half" },
          } as Question,
        })}
      />,
    );
    const wrapper = container.querySelector('[data-field-id="name"]');
    expect(wrapper?.className).toContain("w-1/2");
  });

  it("applies w-1/3 for third width layout", () => {
    const { container } = render(
      <FieldRenderer
        {...makeProps({
          field: {
            id: "name",
            type: "short_text",
            label: "Name",
            layout: { width: "third" },
          } as Question,
        })}
      />,
    );
    const wrapper = container.querySelector('[data-field-id="name"]');
    expect(wrapper?.className).toContain("w-1/3");
  });

  it("passes fieldValues to the component", () => {
    const SpyComponent = vi.fn(() => <div>spy</div>) as any;
    render(
      <FieldRenderer
        {...makeProps({
          registry: { short_text: SpyComponent } as FieldRegistry,
          fieldValues: { name: "Jane", age: 30 },
        })}
      />,
    );
    const passedProps = SpyComponent.mock.calls[0][0];
    expect(passedProps.fieldValues).toEqual({ name: "Jane", age: 30 });
  });

  it("passes customProps from field to component", () => {
    const SpyComponent = vi.fn(() => <div>spy</div>) as any;
    render(
      <FieldRenderer
        {...makeProps({
          field: {
            id: "name",
            type: "short_text",
            label: "Name",
            customProps: { maxChars: 100 },
          } as Question,
          registry: { short_text: SpyComponent } as FieldRegistry,
        })}
      />,
    );
    const passedProps = SpyComponent.mock.calls[0][0];
    expect(passedProps.customProps).toEqual({ maxChars: 100 });
  });
});
