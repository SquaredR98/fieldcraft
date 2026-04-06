import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { cn } from "../utils/cn";

export type ErrorSummaryProps = {
  errors: Record<string, string[]>;
  fieldLabels?: Record<string, string>;
  onFieldClick?: (fieldId: string) => void;
  className?: string;
};

export function ErrorSummary({
  errors,
  fieldLabels,
  onFieldClick,
  className,
}: ErrorSummaryProps) {
  const fieldIds = Object.keys(errors).filter(
    (id) => errors[id] && errors[id].length > 0,
  );

  if (fieldIds.length === 0) return null;

  return (
    <Alert
      variant="destructive"
      className={cn("fe-error-bg", className)}
      aria-label="Validation errors"
    >
      <AlertTitle>
        Please fix {fieldIds.length} error{fieldIds.length > 1 ? "s" : ""} before
        submitting
      </AlertTitle>
      <AlertDescription>
        <ul className="flex flex-col gap-1 list-none">
          {fieldIds.map((fieldId) => (
            <li key={fieldId}>
              <button
                type="button"
                className="bg-transparent border-0 text-foreground text-sm cursor-pointer text-left p-0 hover:underline"
                onClick={() => onFieldClick?.(fieldId)}
              >
                <strong>{fieldLabels?.[fieldId] ?? fieldId}:</strong>{" "}
                {errors[fieldId][0]}
              </button>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
