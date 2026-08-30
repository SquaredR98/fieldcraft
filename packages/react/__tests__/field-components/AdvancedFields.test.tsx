import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HiddenField } from "../../src/components/fields/HiddenField";
import { MatrixField } from "../../src/components/fields/MatrixField";
import { ScoringField } from "../../src/components/fields/ScoringField";
import { AddressField } from "../../src/components/fields/AddressField";
import { PaymentField } from "../../src/components/fields/PaymentField";
import { AppointmentField } from "../../src/components/fields/AppointmentField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

describe("Advanced Form Fields", () => {
  it("HiddenField renders hidden input with current value", () => {
    const props: FieldProps = {
      field: { id: "utm_source", type: "hidden", label: "UTM Source" } as Question,
      value: "google",
      error: undefined,
      touched: false,
      disabled: false,
      readonly: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      theme: {},
    };
    const { container } = render(<HiddenField {...props} />);
    const input = container.querySelector("input[type='hidden']");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("google");
  });

  it("MatrixField renders grid table and calls onChange when selecting cells", () => {
    const onChange = vi.fn();
    const props: FieldProps = {
      field: {
        id: "features",
        type: "matrix",
        label: "Feature Ratings",
        config: {
          type: "matrix",
          rows: [
            { label: "UI Design", value: "ui" },
            { label: "Speed", value: "speed" },
          ],
          columns: [
            { label: "Bad", value: "1" },
            { label: "Good", value: "2" },
          ],
          inputType: "radio",
        },
      } as Question,
      value: { ui: "2" },
      error: undefined,
      touched: false,
      disabled: false,
      readonly: false,
      onChange,
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      theme: {},
    };

    render(<MatrixField {...props} />);
    expect(screen.getByText("UI Design")).toBeInTheDocument();
    expect(screen.getByText("Speed")).toBeInTheDocument();
    expect(screen.getByText("Bad")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();

    const speedGoodRadio = screen.getAllByRole("radio")[3]; // speed -> 2
    fireEvent.click(speedGoodRadio);
    expect(onChange).toHaveBeenCalledWith({ ui: "2", speed: "2" });
  });

  it("ScoringField renders options with score indicators and updates value on select", () => {
    const onChange = vi.fn();
    const props: FieldProps = {
      field: {
        id: "quizQ1",
        type: "scoring",
        label: "Which is correct?",
        config: {
          type: "scoring",
          showScore: true,
          options: [
            { label: "Option A", value: "a", score: 5 },
            { label: "Option B", value: "b", score: 10 },
          ],
        },
      } as Question,
      value: "a",
      error: undefined,
      touched: false,
      disabled: false,
      readonly: false,
      onChange,
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      theme: {},
    };

    render(<ScoringField {...props} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Option B"));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("AddressField renders street, city, state, postal code, and country subfields", () => {
    const onChange = vi.fn();
    const props: FieldProps = {
      field: {
        id: "billingAddress",
        type: "address",
        label: "Billing Address",
      } as Question,
      value: { street: "123 Main St", city: "Springfield" },
      error: undefined,
      touched: false,
      disabled: false,
      readonly: false,
      onChange,
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      theme: {},
    };

    render(<AddressField {...props} />);
    expect(screen.getByPlaceholderText("Street address")).toHaveValue("123 Main St");
    expect(screen.getByPlaceholderText("City")).toHaveValue("Springfield");
    expect(screen.getByPlaceholderText("State / Province")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ZIP / Postal")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("ZIP / Postal"), { target: { value: "90210" } });
    expect(onChange).toHaveBeenCalledWith({ street: "123 Main St", city: "Springfield", zip: "90210" });
  });

  it("PaymentField renders payment placeholder and details", () => {
    const props: FieldProps = {
      field: {
        id: "pay",
        type: "payment",
        label: "Card Payment",
        config: {
          type: "payment",
          amount: 49.99,
          currency: "USD",
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
    };

    render(<PaymentField {...props} />);
    expect(screen.getByText("Card Payment")).toBeInTheDocument();
    expect(screen.getByText(/USD/)).toBeInTheDocument();
    expect(screen.getByText(/49\.99/)).toBeInTheDocument();
  });

  it("AppointmentField renders available static slots and selects date and time", () => {
    const onChange = vi.fn();
    const props: FieldProps = {
      field: {
        id: "meeting",
        type: "appointment",
        label: "Schedule Consultation",
        config: {
          type: "appointment",
          duration: 30,
          slots: [
            { date: "2026-09-01", times: ["09:00", "10:00", "11:00"] },
            { date: "2026-09-02", times: ["14:00", "15:00"] },
          ],
        },
      } as Question,
      value: undefined,
      error: undefined,
      touched: false,
      disabled: false,
      readonly: false,
      onChange,
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      theme: {},
    };

    render(<AppointmentField {...props} />);
    expect(screen.getByText("Schedule Consultation")).toBeInTheDocument();
    expect(screen.getByText(/30 min/)).toBeInTheDocument();

    // Select a time slot
    fireEvent.click(screen.getByText("09:00"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        date: "2026-09-01",
        time: "09:00",
        status: "confirmed",
      }),
    );
  });
});
