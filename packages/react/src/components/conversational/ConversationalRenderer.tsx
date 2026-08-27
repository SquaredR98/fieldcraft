import { useCallback, useEffect, useRef } from "react";
import type { FormEngine, FormEngineTheme } from "@squaredr/fieldcraft-core";
import type { FieldRegistry } from "../../registry/field-registry";
import { FieldRenderer } from "../FieldRenderer";
import { cn } from "../../utils/cn";

/** Field types that auto-advance in conversational mode after selection. */
const AUTO_ADVANCE_TYPES = new Set([
  "single_select",
  "boolean",
  "rating",
  "nps",
  "opinion_scale",
  "likert",
  "dropdown",
  "country_select",
]);

export type ConversationalRendererProps = {
  engine: FormEngine;
  theme: FormEngineTheme;
  registry: FieldRegistry;
  autoFocus?: boolean;
  autoAdvance?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  onSubmit: () => void;
};

/**
 * Conversational mode: renders ONE question at a time with prev/next
 * navigation and keyboard support (Enter to advance).
 */
export function ConversationalRenderer({
  engine,
  theme,
  registry,
  autoFocus = true,
  autoAdvance = true,
  prevLabel = "Back",
  nextLabel = "Next",
  submitLabel = "Submit",
  onSubmit,
}: ConversationalRendererProps) {
  const state = engine.getState();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentQuestion = engine.getQuestionById(state.currentQuestionId);
  const isLastQuestion = !state.canGoNextQuestion;

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      onSubmit();
    } else {
      engine.nextQuestion();
    }
  }, [engine, isLastQuestion, onSubmit]);

  const handlePrev = useCallback(() => {
    engine.prevQuestion();
  }, [engine]);

  // Auto-advance: after selecting a value on qualifying field types,
  // advance to the next question after a short delay.
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleChange = useCallback(
    (fieldId: string, value: unknown) => {
      engine.setValue(fieldId, value);

      if (!autoAdvance || !currentQuestion) return;
      if (!AUTO_ADVANCE_TYPES.has(currentQuestion.type)) return;
      // Only advance if a value was actually selected (not cleared)
      if (value === undefined || value === null || value === "") return;

      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = setTimeout(() => {
        handleNext();
      }, 350);
    },
    [engine, autoAdvance, currentQuestion, handleNext],
  );

  // Clean up timer on unmount or question change
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, [state.currentQuestionId]);

  // Keyboard: Enter to advance
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" && !e.shiftKey) {
        // Don't intercept Enter in textarea fields
        const target = e.target as HTMLElement;
        if (target.tagName === "TEXTAREA") return;
        // Don't intercept if in a select/dropdown
        if (target.role === "listbox" || target.role === "option") return;
        e.preventDefault();
        handleNext();
      }
    }

    const container = containerRef.current;
    container?.addEventListener("keydown", handleKeyDown);
    return () => container?.removeEventListener("keydown", handleKeyDown);
  }, [handleNext]);

  // Auto-focus on question change
  useEffect(() => {
    if (!autoFocus || !containerRef.current) return;
    const focusable = containerRef.current.querySelector<HTMLElement>(
      'input:not([type="hidden"]), select, textarea, [tabindex="0"]',
    );
    focusable?.focus();
  }, [autoFocus, state.currentQuestionId]);

  if (!currentQuestion) {
    return null;
  }

  return (
    <div ref={containerRef} className="fc-mode-conversational flex flex-col gap-6">
      {/* Question counter */}
      <div className="text-sm text-muted-foreground">
        {state.currentQuestionIndex + 1} / {state.totalVisibleQuestions}
      </div>

      {/* Progress bar */}
      <div
        className="h-1 bg-border rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={state.questionProgressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Question ${state.currentQuestionIndex + 1} of ${state.totalVisibleQuestions}`}
      >
        <div
          className="h-full bg-primary rounded-full transition-[width] duration-300 ease-in-out"
          style={{ width: `${state.questionProgressPercent}%` }}
        />
      </div>

      {/* Single question */}
      <div className={cn("transition-opacity duration-200")}>
        <FieldRenderer
          field={currentQuestion}
          value={state.values[currentQuestion.id]}
          error={state.errors[currentQuestion.id]}
          touched={!!state.touched[currentQuestion.id]}
          disabled={engine.isFieldDisabled(currentQuestion.id)}
          readonly={engine.isFieldReadonly(currentQuestion.id)}
          onChange={(val) => handleChange(currentQuestion.id, val)}
          onBlur={() => engine.touchField(currentQuestion.id)}
          onFocus={() => engine.focusField(currentQuestion.id)}
          theme={theme}
          registry={registry}
          fieldValues={state.values}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-3 pt-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!state.canGoPrevQuestion}
          className={cn(
            "px-4 py-2 text-sm rounded-md border border-border",
            "transition-colors",
            state.canGoPrevQuestion
              ? "hover:bg-accent text-foreground"
              : "text-muted-foreground opacity-50 cursor-not-allowed",
          )}
          aria-label={prevLabel}
        >
          {prevLabel}
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={state.isSubmitting}
          className={cn(
            "px-6 py-2 text-sm rounded-md",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors",
            state.isSubmitting && "opacity-50 cursor-not-allowed",
          )}
          aria-label={isLastQuestion ? submitLabel : nextLabel}
        >
          {state.isSubmitting
            ? "Submitting\u2026"
            : isLastQuestion
              ? submitLabel
              : nextLabel}
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-muted-foreground text-center">
        Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Enter</kbd> to continue
      </p>
    </div>
  );
}
