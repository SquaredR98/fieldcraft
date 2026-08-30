import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConversationalRenderer } from "../../src/components/conversational/ConversationalRenderer";
import { createEngine } from "@squaredr/fieldcraft-core";
import { defaultRegistry } from "../../src/registry/default-registry";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

const conversationalSchema: FormEngineSchema = {
  id: "conversational-form",
  version: "1.0.0",
  title: "Conversational Form",
  settings: { displayMode: "conversational" },
  sections: [
    {
      id: "sec1",
      title: "Section 1",
      questions: [
        { id: "q1", type: "short_text", label: "What is your name?", required: true },
        { id: "q2", type: "number", label: "What is your age?", required: true },
        { id: "q3", type: "single_select", label: "Preferred role?", options: [{ label: "Dev", value: "dev" }, { label: "Design", value: "design" }] },
      ],
    },
  ],
  submitAction: { type: "callback" },
};

describe("ConversationalRenderer Component", () => {
  it("renders one question at a time with question counter and progress", () => {
    const engine = createEngine(conversationalSchema);
    const onSubmit = vi.fn();

    render(
      <ConversationalRenderer
        engine={engine}
        theme={{}}
        registry={defaultRegistry}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByText("What is your name?")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(screen.queryByText("What is your age?")).not.toBeInTheDocument();
  });

  it("blocks advancement when current question has validation error", async () => {
    const engine = createEngine(conversationalSchema);
    const onSubmit = vi.fn();

    render(
      <ConversationalRenderer
        engine={engine}
        theme={{}}
        registry={defaultRegistry}
        onSubmit={onSubmit}
      />,
    );

    const nextBtn = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextBtn);

    // Q1 is required so user remains on question 1
    expect(screen.getByText("What is your name?")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("advances to next question when valid", async () => {
    const engine = createEngine(conversationalSchema, {
      initialValues: { q1: "Alice" },
    });
    const onSubmit = vi.fn();

    const { rerender } = render(
      <ConversationalRenderer
        engine={engine}
        theme={{}}
        registry={defaultRegistry}
        onSubmit={onSubmit}
      />,
    );

    const nextBtn = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextBtn);

    rerender(
      <ConversationalRenderer
        engine={engine}
        theme={{}}
        registry={defaultRegistry}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByText("What is your age?")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });
});
