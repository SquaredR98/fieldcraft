/**
 * Fallback notice shown when a submission fails to reach its destination and
 * the consumer did not take over via `onSubmitError` returning `false`.
 *
 * The message is a fixed, calm string on purpose. The engine records raw
 * adapter text in `state.submitError` — which can contain hostnames, ports and
 * driver errors — and that must never be rendered to a respondent. Consumers
 * who want the detail get it through `onSubmitError`.
 */
export type SubmitErrorNoticeProps = {
  /** Overrides the default message. Must be safe to show a respondent. */
  message?: string;
};

export function SubmitErrorNotice({ message }: SubmitErrorNoticeProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-foreground"
    >
      {message ?? "We couldn't send your response. Please try again."}
    </div>
  );
}
