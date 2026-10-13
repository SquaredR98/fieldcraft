/**
 * Complete form submission response. Created by the engine on successful submit
 * and passed to `SubmitAdapter.submit()` and the `onSubmit` callback.
 *
 * @since 1.0.0
 */
export type FormResponse = {
  /** ID of the schema that generated this response. */
  schemaId: string;
  /** Version of the schema at time of submission. */
  schemaVersion: string;
  /** ISO 8601 timestamp of when the form was submitted. */
  submittedAt: string;
  /** Unique session token for this form session. Used for draft association. */
  sessionToken: string;
  /** All field values keyed by field ID. */
  values: Record<string, unknown>;
  /** Scoring results keyed by scoring field ID, if any scoring fields exist. */
  scores?: Record<string, number>;
  /** Aggregate total score across all scoring fields. */
  totalScore?: number;
  /** Arbitrary metadata attached to the response (e.g., user agent, referrer). */
  metadata?: Record<string, unknown>;
  /** Time in milliseconds from form load to submission. */
  completionTimeMs?: number;
};

/**
 * Result of a form submission through one or more adapters.
 *
 * @since 1.0.0
 */
export type SubmitResult = {
  /** True if all adapters completed successfully. */
  success: boolean;
  /** Per-adapter results. Useful for debugging when one adapter fails. */
  adapterResults: {
    /** Name of the adapter (from `SubmitAdapter.name`). */
    adapterName: string;
    /** Whether this specific adapter succeeded. */
    success: boolean;
    /** Error message if this adapter failed. */
    error?: string;
  }[];
};

/**
 * Why a submission failed when the input itself was valid.
 *
 * - `delivery` — one or more adapters failed (network, 5xx, timeout). The
 *   response never reached its destination.
 * - `cancelled` — a `beforeSubmit` hook returned `false`. Not a failure; the
 *   consumer stopped the submission deliberately.
 *
 * @since 1.11.0
 */
export type SubmitErrorKind = "delivery" | "cancelled";

/**
 * Detail handed to a consumer when a submission fails for a reason the
 * respondent cannot fix.
 *
 * Validation failures do NOT produce this — those surface as field errors the
 * respondent can act on. This type exists so a consumer can log, retry or
 * queue the payload while the renderer shows the respondent a safe generic
 * message rather than raw adapter text (which can carry hostnames and ports).
 *
 * @since 1.11.0
 */
export type SubmitErrorDetail = {
  /** Why it failed, so consumers can branch without parsing message strings. */
  kind: SubmitErrorKind;
  /** Joined adapter messages, as the engine recorded them. Not for display to the respondent. */
  message: string;
  /** Per-adapter outcome, so a consumer can see which destination failed. */
  adapterResults: SubmitResult["adapterResults"];
  /**
   * The payload that failed to send, so a consumer can retry or queue it.
   *
   * Optional because `SubmitResult` does not currently carry the response, so
   * a renderer reacting to a failed `submit()` cannot always supply it. The
   * engine populates this where it has it; consumers must handle `undefined`
   * rather than assume a retry payload is available. Tracked as `CORE-16`.
   */
  response?: FormResponse;
};
