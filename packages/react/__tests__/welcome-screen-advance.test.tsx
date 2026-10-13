import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import { FormEngineRenderer } from "../src/components/FormEngineRenderer";

/**
 * `REACT-13` — the welcome screen's Start button actually advances.
 *
 * It used to call `document.querySelector('[data-question-index="1"]')` and
 * scroll to the result. That attribute existed nowhere in the package, so the
 * query always returned null and the button did nothing at all.
 *
 * Reaching into the DOM was the deeper mistake: in stepped mode the next
 * question is not rendered yet, so no selector could have worked. It now goes
 * through the engine via `FormActionsContext`.
 */

function steppedWithWelcome(): FormEngineSchema {
  return {
    id: "welcome-advance",
    version: "1.0.0",
    submitAction: { type: "callback" },
    title: "Welcome advance",
    settings: { displayMode: "stepped", showProgress: false },
    sections: [
      {
        id: "intro",
        title: "Intro",
        questions: [
          {
            id: "welcome",
            type: "welcome-screen",
            label: "Welcome",
            config: {
              type: "welcome-screen",
              heading: "Before we begin",
              buttonText: "Start",
            },
          },
        ],
      },
      {
        id: "questions",
        title: "Questions",
        questions: [{ id: "name", type: "short_text", label: "Your name" }],
      },
    ],
  };
}

describe("REACT-13 — welcome screen Start button", () => {
  it("advances the form when clicked", async () => {
    render(<FormEngineRenderer schema={steppedWithWelcome()} onSubmit={vi.fn()} />);

    expect(screen.getByText("Before we begin")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    // The regression: this assertion failed for every value of the old
    // selector, because the button never did anything.
    await waitFor(() =>
      expect(screen.getByText("Questions")).toBeInTheDocument(),
    );
  });

  it("does not touch the DOM looking for data-question-index", () => {
    // Guard against the old approach returning. Nothing in the package should
    // depend on an attribute the package does not emit.
    const spy = vi.spyOn(document, "querySelector");
    render(<FormEngineRenderer schema={steppedWithWelcome()} onSubmit={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    const usedTheDeadSelector = spy.mock.calls.some((c) =>
      String(c[0]).includes("data-question-index"),
    );
    expect(usedTheDeadSelector).toBe(false);
    spy.mockRestore();
  });

  it("hides the button in classic mode, where there is nowhere to advance", () => {
    // Every question is already on screen, so a Start button would do nothing
    // however it was wired. Hidden rather than inert.
    const schema = steppedWithWelcome();
    schema.settings = { displayMode: "classic", showProgress: false };

    render(<FormEngineRenderer schema={schema} onSubmit={vi.fn()} />);

    expect(screen.getByText("Before we begin")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Start" })).toBeNull();
  });
});
