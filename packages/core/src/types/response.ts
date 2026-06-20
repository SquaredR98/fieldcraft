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
