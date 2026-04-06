import type { CompleteAction } from "@squaredr/formengine-core";
import { Button } from "./ui/button";
import { cn } from "../utils/cn";

export type CompletionScreenProps = {
  action?: CompleteAction;
  className?: string;
};

export function CompletionScreen({ action, className }: CompletionScreenProps) {
  const message =
    action?.message ?? "Thank you! Your response has been submitted.";

  return (
    <div className={cn("flex flex-col items-center gap-4 px-6 py-12 text-center", className)} role="status" aria-live="polite">
      <div aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-500"
          width={48}
          height={48}
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <p className="text-lg text-foreground">{message}</p>
      {action?.type === "redirect" && action.url && (
        <Button asChild>
          <a href={action.url}>Continue</a>
        </Button>
      )}
    </div>
  );
}
