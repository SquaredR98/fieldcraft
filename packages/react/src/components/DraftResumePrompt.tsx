import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "../utils/cn";

export type DraftResumePromptProps = {
  lastSavedAt?: string;
  onResume: () => void;
  onDiscard: () => void;
  className?: string;
};

export function DraftResumePrompt({
  lastSavedAt,
  onResume,
  onDiscard,
  className,
}: DraftResumePromptProps) {
  const formattedDate = lastSavedAt
    ? new Date(lastSavedAt).toLocaleString()
    : undefined;

  return (
    <Card className={cn("text-center", className)}>
      <CardContent className="flex flex-col items-center gap-4 pt-6" role="dialog" aria-label="Resume draft">
        <p className="text-base">
          You have a saved draft
          {formattedDate ? ` from ${formattedDate}` : ""}.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={onResume}>
            Resume
          </Button>
          <Button variant="outline" onClick={onDiscard}>
            Start over
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
