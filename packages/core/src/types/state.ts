/**
 * Complete runtime state of a form engine instance. Returned by `engine.getState()`
 * and used by `useSyncExternalStore` in the React renderer.
 *
 * @description This is a read-only snapshot. To mutate state, use engine methods
 * like `setValue()`, `nextSection()`, `submit()`, etc.
 *
 * @since 1.0.0
 */
export type FormState = {
  /** Current field values keyed by field ID. */
  values: Record<string, unknown>;
  /** Validation errors keyed by field ID. Each field can have multiple error messages. */
  errors: Record<string, string[]>;
  /** Tracks which fields the user has interacted with (focused then blurred). */
  touched: Record<string, boolean>;
  /** True if any field value differs from its initial/prefilled value. */
  isDirty: boolean;

  /** True while the form is actively submitting (between submit call and response). */
  isSubmitting: boolean;
  /** True after a successful submission. */
  isSubmitted: boolean;
  /** Error message from a failed submission attempt. */
  submitError?: string;
  /** True after the user has clicked submit at least once (enables showing all errors). */
  submitAttempted: boolean;

  /** ID of the currently active section. */
  currentSectionId: string;
  /** Zero-based index of the current section among visible sections. */
  currentSectionIndex: number;
  /** Total number of visible sections (excludes sections hidden by `showIf`). */
  totalVisibleSections: number;
  /** Overall form completion percentage (0–100). */
  progressPercent: number;
  /** Ordered list of section IDs that are currently visible. */
  visibleSectionIds: string[];
  /** Section IDs the user has visited (navigated to at least once). */
  visitedSectionIds: string[];

  /** Whether the user can navigate forward (current section is valid or skip is allowed). */
  canGoNext: boolean;
  /** Whether the user can navigate backward (not on the first section). */
  canGoPrev: boolean;
  /** Whether all required fields in the current section pass validation. */
  isCurrentSectionValid: boolean;

  /** Scoring results keyed by scoring field ID. Used by scoring-type fields. */
  scores: Record<string, number>;
  /** Aggregate score across all scoring fields. */
  totalScore?: number;

  /** Whether a saved draft exists for this form. */
  hasDraft: boolean;
  /** ISO timestamp of the last draft save. */
  lastDraftSavedAt?: string;
};
