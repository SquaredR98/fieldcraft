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

      {isLastSection ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          aria-label={submitLabel}
        >
          {isSubmitting ? "Submitting\u2026" : submitLabel}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          aria-label={nextLabel}
        >
          {nextLabel}
        </Button>
      )}
    </div>
  );
}
