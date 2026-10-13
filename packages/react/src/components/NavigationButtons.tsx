import { Button } from "./ui/button";
import { cn } from "../utils/cn";

export type NavigationButtonsProps = {
  canGoPrev: boolean;
  canGoNext: boolean;
  isLastSection: boolean;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  className?: string;
  prevLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  /**
   * Set when rendered inside a `<form>` whose submit handler already advances
   * or submits — as `FormEngineRenderer` does in every display mode.
   *
   * The forward button is then `type="submit"` with **no** click handler, so
   * Enter and a click take one path. This matters because `nextSection()` is
   * not idempotent: running `onNext` on click *and* letting the submit event
   * fire would advance twice and skip a step.
   *
   * Left unset (the default) the buttons are plain `type="button"` controls
   * driven by `onNext` / `onSubmit`, which is what a consumer rendering this
   * component standalone needs.
   *
   * @since 1.12.0
   */
  insideForm?: boolean;
};

export function NavigationButtons({
  canGoPrev,
  canGoNext,
  isLastSection,
  isSubmitting,
  onPrev,
  onNext,
  onSubmit,
  className,
  prevLabel = "Back",
  nextLabel = "Next",
  submitLabel = "Submit",
  insideForm = false,
}: NavigationButtonsProps) {
  return (
    <div className={cn("flex justify-between gap-3 pt-2", className)}>
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
        disabled={!canGoPrev}
        aria-label={prevLabel}
      >
        {prevLabel}
      </Button>

      {/* Inside a form the forward button submits and carries no click
          handler \u2014 the form's onSubmit does the work, so Enter and a click
          are one path. Outside a form it is an ordinary button driven by the
          callback. Never both: `nextSection()` advances on every call, so
          doing both would skip a step. */}
      {isLastSection ? (
        <Button
          type={insideForm ? "submit" : "button"}
          onClick={insideForm ? undefined : onSubmit}
          disabled={isSubmitting}
          aria-label={submitLabel}
        >
          {isSubmitting ? "Submitting\u2026" : submitLabel}
        </Button>
      ) : (
        <Button
          type={insideForm ? "submit" : "button"}
          onClick={insideForm ? undefined : onNext}
          disabled={!canGoNext}
          aria-label={nextLabel}
        >
          {nextLabel}
        </Button>
      )}
    </div>
  );
}
