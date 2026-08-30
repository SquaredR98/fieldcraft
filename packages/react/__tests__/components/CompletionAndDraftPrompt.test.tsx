import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CompletionScreen } from "../../src/components/CompletionScreen";
import { DraftResumePrompt } from "../../src/components/DraftResumePrompt";

describe("CompletionScreen & DraftResumePrompt Components", () => {
  describe("CompletionScreen", () => {
    it("renders default completion thank you message", () => {
      render(<CompletionScreen />);
      expect(screen.getByText("Thank you! Your response has been submitted.")).toBeInTheDocument();
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("renders custom message and redirect link button", () => {
      render(
        <CompletionScreen
          action={{
            type: "redirect",
            message: "All done! Taking you back home.",
            url: "https://example.com/home",
          }}
        />,
      );
      expect(screen.getByText("All done! Taking you back home.")).toBeInTheDocument();
      const link = screen.getByRole("link", { name: "Continue" });
      expect(link).toHaveAttribute("href", "https://example.com/home");
    });
  });

  describe("DraftResumePrompt", () => {
    it("renders resume prompt with formatted timestamp", () => {
      const onResume = vi.fn();
      const onDiscard = vi.fn();

      render(
        <DraftResumePrompt
          lastSavedAt="2026-06-15T10:30:00.000Z"
          onResume={onResume}
          onDiscard={onDiscard}
        />,
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText(/You have a saved draft/)).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Resume" }));
      expect(onResume).toHaveBeenCalledOnce();

      fireEvent.click(screen.getByRole("button", { name: "Start over" }));
      expect(onDiscard).toHaveBeenCalledOnce();
    });
  });
});
