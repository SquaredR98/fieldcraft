import { cn } from "../utils/cn";

export type ProgressBarProps = {
  percent: number;
  currentStep: number;
  totalSteps: number;
  className?: string;
};

export function ProgressBar({
  percent,
  currentStep,
  totalSteps,
  className,
}: ProgressBarProps) {
  return (
    <div
      className={cn("flex items-center gap-3", className)}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Section ${currentStep} of ${totalSteps}`}
    >
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-[width] duration-300 ease-in-out"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {currentStep} / {totalSteps}
      </span>
    </div>
  );
}
