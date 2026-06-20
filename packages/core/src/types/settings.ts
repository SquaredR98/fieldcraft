/**
 * Form-level behavior settings for display, navigation, drafts, and prefill.
 *
 * @example
 * ```typescript
 * const settings: FormSettings = {
 *   displayMode: "stepped",
 *   showProgress: true,
 *   progressStyle: "steps",
 *   allowDraftSave: true,
 *   draftTtlHours: 72,
 *   navigation: { showBack: true, allowSkip: false },
 * };
 * ```
 *
 * @since 1.0.0
 */
export type FormSettings = {
  /** How the form is rendered: all sections at once, one step at a time, or one question at a time. */
  displayMode?: "classic" | "stepped" | "conversational";
  /** Whether to auto-save form progress to localStorage. Defaults to `true`. */
  allowDraftSave?: boolean;
  /** Where drafts are stored. */
  draftStorage?: "local" | "server" | "both";
  /** Hours before a saved draft expires. Defaults to 72. */
  draftTtlHours?: number;
  /** Whether to show a progress indicator in multi-step mode. */
  showProgress?: boolean;
  /** Style of the progress indicator. */
  progressStyle?: "bar" | "steps" | "percentage";
  /** Prefill configuration for populating fields from external data. */
  prefill?: PrefillConfig;
  /** When true, field values are excluded from console/debug logs. */
  noPiiInLogs?: boolean;
  /** Locale string for i18n (e.g., "en-US", "fr-FR"). */
  locale?: string;
  /** Base URL for server-side operations (draft save, async validation). */
  serverUrl?: string;
  /** Customization for the submit button labels. */
  submitButton?: {
    /** Default button label. */
    label?: string;
    /** Label shown during submission. */
    loadingLabel?: string;
    /** Label shown briefly after successful submission. */
    successLabel?: string;
  };
  /** Multi-step navigation configuration. */
  navigation?: {
    /** Whether to show a back/previous button. */
    showBack?: boolean;
    /** Whether to show a section list sidebar for direct navigation. */
    showSectionList?: boolean;
    /** Custom label for the next button. */
    nextLabel?: string;
    /** Custom label for the back button. */
    backLabel?: string;
    /** Whether users can skip sections without completing validation. */
    allowSkip?: boolean;
  };
};

/**
 * Configuration for prefilling form fields from URL parameters or programmatic data.
 *
 * @example
 * ```typescript
 * const prefill: PrefillConfig = {
 *   source: "both",
 *   paramPrefix: "fc_",
 *   // URL: ?fc_email=jane@co.com → prefills "email" field
 * };
 * ```
 *
 * @since 1.0.0
 */
export type PrefillConfig = {
  /** Where prefill data comes from: component props, URL query params, or both. */
  source: "props" | "url" | "both";
  /** Prefix stripped from URL param names to match field `prefillKey` values. */
  paramPrefix?: string;
  /** Optional transform function applied to raw prefill data before field matching. */
  transform?: (raw: Record<string, string>) => Record<string, unknown>;
};
