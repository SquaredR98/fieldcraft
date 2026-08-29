import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NavigationButtons } from "../../src/components/NavigationButtons";

function makeProps(overrides?: Partial<Parameters<typeof NavigationButtons>[0]>) {
  return {
    canGoPrev: true,
    canGoNext: true,
    isLastSection: false,
    isSubmitting: false,
    onPrev: vi.fn(),
    onNext: vi.fn(),
    onSubmit: vi.fn(),
    ...overrides,
  };
}

describe("NavigationButtons", () => {
  it("renders Back and Next buttons", () => {
    render(<NavigationButtons {...makeProps()} />);
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("calls onPrev when Back is clicked", () => {
    const onPrev = vi.fn();
    render(<NavigationButtons {...makeProps({ onPrev })} />);
    fireEvent.click(screen.getByText("Back"));
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it("calls onNext when Next is clicked", () => {
    const onNext = vi.fn();
    render(<NavigationButtons {...makeProps({ onNext })} />);
    fireEvent.click(screen.getByText("Next"));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it("disables Back when canGoPrev is false", () => {
    render(<NavigationButtons {...makeProps({ canGoPrev: false })} />);
    expect(screen.getByText("Back")).toBeDisabled();
  });

  it("disables Next when canGoNext is false", () => {
    render(<NavigationButtons {...makeProps({ canGoNext: false })} />);
    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("shows Submit instead of Next on last section", () => {
    render(<NavigationButtons {...makeProps({ isLastSection: true })} />);
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("calls onSubmit when Submit is clicked", () => {
    const onSubmit = vi.fn();
    render(<NavigationButtons {...makeProps({ isLastSection: true, onSubmit })} />);
    fireEvent.click(screen.getByText("Submit"));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("disables Submit when isSubmitting is true", () => {
    render(
      <NavigationButtons {...makeProps({ isLastSection: true, isSubmitting: true })} />,
    );
    expect(screen.getByText("Submitting\u2026")).toBeDisabled();
  });

  it("shows 'Submitting...' text when submitting", () => {
    render(
      <NavigationButtons {...makeProps({ isLastSection: true, isSubmitting: true })} />,
    );
    expect(screen.getByText("Submitting\u2026")).toBeInTheDocument();
  });

  it("supports custom labels", () => {
    render(
      <NavigationButtons
        {...makeProps({
          prevLabel: "Previous",
          nextLabel: "Continue",
        })}
      />,
    );
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("supports custom submit label", () => {
    render(
      <NavigationButtons
        {...makeProps({
          isLastSection: true,
          submitLabel: "Finish",
        })}
      />,
    );
    expect(screen.getByText("Finish")).toBeInTheDocument();
  });

  it("sets aria-label on buttons", () => {
    render(<NavigationButtons {...makeProps()} />);
    expect(screen.getByLabelText("Back")).toBeInTheDocument();
    expect(screen.getByLabelText("Next")).toBeInTheDocument();
  });
});
