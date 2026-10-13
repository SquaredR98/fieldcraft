import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import { FormEngineRenderer } from "../src/components/FormEngineRenderer";

/**
 * The case this feature exists for: clinical question wording.
 *
 * PHQ-9 and GAD-7 both frame items as "over the last 2 weeks", and that
 * timeframe needs emphasis inside the question — not in a separate block that
 * a screen reader treats as unrelated content.
 */
describe("formatted labels through the real renderer", () => {
  const schema: FormEngineSchema = {
    id: "phq-style",
    version: "1.0.0",
    submitAction: { type: "callback" },
    title: "Screening",
    settings: { displayMode: "classic", showProgress: false },
    sections: [
      {
        id: "s1",
        title: "Items",
        questions: [
          {
            id: "q1",
            type: "short_text",
            label: "Over the **last 2 weeks**, how often were you bothered?",
            labelFormat: "markdown",
            helpText: "Choose the answer that best describes _your_ experience.",
            helpTextFormat: "markdown",
          },
        ],
      },
    ],
  };

  it("emphasises the timeframe inside the label, bound to the input", () => {
    const { container } = render(
      <FormEngineRenderer schema={schema} onSubmit={vi.fn()} />,
    );

    const strong = container.querySelector("label strong");
    expect(strong?.textContent).toBe("last 2 weeks");

    // The label still points at the input — the whole reason formatting lives
    // on the question rather than in a block beside it.
    expect(container.querySelector("label")).toHaveAttribute("for", "q1");
  });

  it("formats help text too", () => {
    const { container } = render(
      <FormEngineRenderer schema={schema} onSubmit={vi.fn()} />,
    );
    expect(container.querySelector("#q1-help em")?.textContent).toBe("your");
  });

  it("leaves an unformatted label literal", () => {
    const plain: FormEngineSchema = {
      ...schema,
      sections: [
        {
          id: "s1",
          title: "Items",
          questions: [{ id: "q1", type: "short_text", label: "Rate 1 * 2 stars" }],
        },
      ],
    };
    render(<FormEngineRenderer schema={plain} onSubmit={vi.fn()} />);
    expect(screen.getByText("Rate 1 * 2 stars")).toBeInTheDocument();
  });
});
