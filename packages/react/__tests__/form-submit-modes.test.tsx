import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import { FormEngineRenderer } from "../src/components/FormEngineRenderer";

/**
 * `REACT-11` — one rule across all three display modes.
 *
 * A form submit event means "the user is done with what is in front of them".
 * The engine decides whether that means advance or finish. These tests assert
 * the decision, not the implementation: Enter and a click must take the same
 * path, and neither may finish a form that still has steps left.
 */

const twoStep: FormEngineSchema = {
  id: "two-step",
  version: "1.0.0",
  submitAction: { type: "callback" },
  title: "Two step",
  settings: { displayMode: "stepped", showProgress: false },
  sections: [
    {
      id: "s1",
      title: "First",
      questions: [{ id: "a", type: "short_text", label: "A" }],
    },
    {
      id: "s2",
      title: "Second",
      questions: [{ id: "b", type: "short_text", label: "B" }],
    },
  ],
};

const oneStep: FormEngineSchema = {
  ...twoStep,
  id: "one-step",
  settings: { displayMode: "classic", showProgress: false },
  sections: [twoStep.sections[0]],
};

describe("REACT-11 — the form element", () => {
  it("renders a real <form>, not a div", () => {
    const { container } = render(
      <FormEngineRenderer schema={oneStep} onSubmit={vi.fn()} />,
    );
    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    // The engine owns validation; native bubbles would compete with its
    // own messages.
    expect(form).toHaveAttribute("novalidate");
  });

  it("carries the display mode on the form element", () => {
    const { container } = render(
      <FormEngineRenderer schema={twoStep} onSubmit={vi.fn()} />,
    );
    expect(container.querySelector("form")).toHaveAttribute(
      "data-display-mode",
      "stepped",
    );
  });
});

describe("REACT-11 — classic mode", () => {
  it("submits on submit, because there is nothing to advance to", async () => {
    const onSubmit = vi.fn();
    render(<FormEngineRenderer schema={oneStep} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });
});

describe("REACT-11 — stepped mode", () => {
  it("advances instead of submitting while steps remain", async () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <FormEngineRenderer schema={twoStep} onSubmit={onSubmit} />,
    );

    expect(screen.getByText("First")).toBeInTheDocument();

    fireEvent.submit(container.querySelector("form")!);

    // The whole point: a submit event on step 1 of 2 must NOT finish the form.
    await waitFor(() => expect(screen.getByText("Second")).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits once the last step is reached", async () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <FormEngineRenderer schema={twoStep} onSubmit={onSubmit} />,
    );
    const form = container.querySelector("form")!;

    fireEvent.submit(form); // step 1 -> 2
    await waitFor(() => expect(screen.getByText("Second")).toBeInTheDocument());

    fireEvent.submit(form); // last step -> submit
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it("advances exactly one step per click — not two", async () => {
    // Regression guard. `nextSection()` is not idempotent, so a forward button
    // that both fires onClick AND lets the submit event through would skip a
    // step. With two sections that is invisible; the submit would simply fire
    // early. Asserted explicitly because the bug is silent.
    const onSubmit = vi.fn();
    render(<FormEngineRenderer schema={twoStep} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => expect(screen.getByText("Second")).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("REACT-11 — conversational mode", () => {
  const conversational: FormEngineSchema = {
    ...twoStep,
    id: "conv",
    settings: { displayMode: "conversational", showProgress: false },
  };

  it("advances through questions without submitting", async () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <FormEngineRenderer
        schema={conversational}
        onSubmit={onSubmit}
        autoAdvance={false}
      />,
    );

    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => expect(screen.getByText("2 / 2")).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
