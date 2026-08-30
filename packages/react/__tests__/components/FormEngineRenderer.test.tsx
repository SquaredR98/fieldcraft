import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FormEngineRenderer } from "../../src/components/FormEngineRenderer";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

const testSchema: FormEngineSchema = {
  id: "test-form",
  version: "1.0.0",
  title: "Test Form",
  sections: [
    {
      id: "sec1",
      title: "Personal",
      questions: [
        { id: "name", type: "short_text", label: "Your Name", required: true },
        { id: "email", type: "email", label: "Email Address", required: true },
      ],
    },
    {
      id: "sec2",
      title: "Feedback",
      questions: [
        { id: "rating", type: "rating", label: "Rating", required: true },
      ],
    },
  ],
  submitAction: { type: "callback" },
};

describe("FormEngineRenderer Orchestrator", () => {
  it("renders in Stepped Mode by default with progress bar and navigation buttons", () => {
    render(<FormEngineRenderer schema={testSchema} />);
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Name/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });

  it("blocks stepped navigation when required section fields are invalid", async () => {
    render(<FormEngineRenderer schema={testSchema} />);
    const nextBtn = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn);

    // Errors should appear and user remains on section 1
    await waitFor(() => {
      expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
    });
    expect(screen.getByText("Personal")).toBeInTheDocument();
  });

  it("advances to section 2 when section 1 is valid", async () => {
    render(<FormEngineRenderer schema={testSchema} initialValues={{ name: "Jane Doe", email: "jane@example.com" }} />);
    const nextBtn = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText("Feedback")).toBeInTheDocument();
      expect(screen.getByText("Rating")).toBeInTheDocument();
    });
  });

  it("renders in Classic Mode when displayMode is 'classic'", () => {
    const classicSchema: FormEngineSchema = {
      ...testSchema,
      settings: { displayMode: "classic" },
    };

    render(<FormEngineRenderer schema={classicSchema} />);
    // In classic mode, all sections render simultaneously on one page
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("Feedback")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  it("renders CompletionScreen upon successful submission", async () => {
    const onSubmit = vi.fn();
    render(
      <FormEngineRenderer
        schema={{
          ...testSchema,
          settings: { displayMode: "classic" },
        }}
        initialValues={{ name: "Jane Doe", email: "jane@example.com", rating: 5 }}
        onSubmit={onSubmit}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
      expect(screen.getByText("Thank you! Your response has been submitted.")).toBeInTheDocument();
    });
  });
});
