import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "../../src/components/ProgressBar";

describe("ProgressBar", () => {
  it("renders with progressbar role", () => {
    render(<ProgressBar percent={50} currentStep={1} totalSteps={3} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-valuenow to percent", () => {
    render(<ProgressBar percent={33} currentStep={1} totalSteps={3} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "33");
  });

  it("sets aria-valuemin to 0 and aria-valuemax to 100", () => {
    render(<ProgressBar percent={50} currentStep={1} totalSteps={2} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("sets aria-label with section info", () => {
    render(<ProgressBar percent={50} currentStep={2} totalSteps={4} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-label", "Section 2 of 4");
  });

  it("displays step counter text", () => {
    render(<ProgressBar percent={75} currentStep={3} totalSteps={4} />);
    expect(screen.getByText("3 / 4")).toBeInTheDocument();
  });

  it("clamps width to 0-100%", () => {
    const { container } = render(
      <ProgressBar percent={150} currentStep={1} totalSteps={1} />,
    );
    const inner = container.querySelector("[style]");
    expect(inner?.getAttribute("style")).toContain("width: 100%");
  });

  it("clamps negative percent to 0%", () => {
    const { container } = render(
      <ProgressBar percent={-10} currentStep={1} totalSteps={1} />,
    );
    const inner = container.querySelector("[style]");
    expect(inner?.getAttribute("style")).toContain("width: 0%");
  });

  it("renders at 0%", () => {
    render(<ProgressBar percent={0} currentStep={1} totalSteps={5} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByText("1 / 5")).toBeInTheDocument();
  });

  it("renders at 100%", () => {
    render(<ProgressBar percent={100} currentStep={5} totalSteps={5} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByText("5 / 5")).toBeInTheDocument();
  });
});
