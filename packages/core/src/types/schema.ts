import type { QuestionType, QuestionConfig } from "./question-types";
import type { ConditionExpression } from "./conditions";
import type { ValidationRule } from "./validation";
import type { FormSettings } from "./settings";

/**
 * Root schema object that defines an entire form.
 *
 * @description The top-level configuration for a FieldCraft form. Contains sections,
 * settings, branding, and submission behavior. Pass this to `FormEngineRenderer` or
 * `createFormEngine()` to render or drive a form.
 *
 * @example
 * ```typescript
 * const schema: FormEngineSchema = {
 *   id: "contact-form",
 *   version: "1.0.0",
 *   title: "Contact Us",
 *   sections: [{ id: "main", title: "Info", questions: [...] }],
 *   submitAction: { type: "callback" },
 * };
 * ```
 *
 * @since 1.0.0
 */
export type FormEngineSchema = {
  /** Unique identifier for this form schema. Used for draft storage and response tracking. */
  id: string;
  /** Semantic version string for schema versioning (e.g., "1.0.0"). */
  version: string;
  /** Display title shown at the top of the form. */
  title: string;
  /** Optional subtitle or description displayed below the title. */
  description?: string;
  /** Optional branding configuration (logo, favicon, powered-by badge). */
  branding?: BrandingConfig;
  /** Form behavior settings: display mode, draft saving, progress, navigation, prefill. */
  settings?: FormSettings;
  /** Ordered array of sections. Each section becomes a step in multi-step mode. */
  sections: Section[];
  /** How the form submits data: HTTP POST, callback function, or storage adapter. */
  submitAction: SubmitAction;
  /** What happens after successful submission: redirect, message, or callback. */
  onComplete?: CompleteAction;
};

/**
 * Branding configuration for the form header.
 *
 * @since 1.0.0
 */
export type BrandingConfig = {
  /** URL to the logo image displayed in the form header. */
  logoUrl?: string;
  /** Alt text for the logo image. */
  logoAlt?: string;
  /** URL to a favicon for the form page. */
  faviconUrl?: string;
  /** Whether to show a "Powered by FieldCraft" badge. Defaults to `true`. */
  poweredBy?: boolean;
};

/**
 * A form section that groups related questions. Each section becomes one step
 * in multi-step forms (stepped/conversational display modes).
 *
 * @example
 * ```typescript
 * const section: Section = {
 *   id: "contact-info",
 *   title: "Contact Information",
 *   description: "How can we reach you?",
 *   questions: [
 *     { id: "email", type: "email", label: "Email", required: true },
 *     { id: "phone", type: "phone", label: "Phone" },
 *   ],
 * };
 * ```
 *
 * @since 1.0.0
 */
export type Section = {
  /** Unique identifier for this section. Referenced by navigation and jump rules. */
  id: string;
  /** Display title for the section header. */
  title: string;
  /** Optional description displayed below the section title. */
  description?: string;
  /** Conditional expression that controls section visibility. When falsy, section is hidden and skipped. */
  showIf?: ConditionExpression;
  /** Ordered array of questions/fields in this section. */
  questions: Question[];
  /** Optional branching rules evaluated when the user exits this section. */
  onExit?: SectionExitAction;
};

/**
 * A single form field/question. Defines the field type, label, validation,
 * conditional visibility, and type-specific configuration.
 *
 * @description Non-input types (`info_block`, `divider`, `spacer`, `section_header`,
 * `page_break`, `welcome-screen`, `thank-you-screen`, `rich-text`, `image`, `video`)
 * must NOT have `required` or `validation` properties — the schema validator will
 * throw `FormEngineSchemaError` for these.
 *
 * @example
 * ```typescript
 * const question: Question = {
 *   id: "email",
 *   type: "email",
 *   label: "Email Address",
 *   required: true,
 *   placeholder: "you@company.com",
 *   validation: [{ type: "email" }],
 *   showIf: { field: "wants_newsletter", operator: "eq", value: true },
 * };
 * ```
 *
 * @since 1.0.0
 */
export type Question = {
  /** Unique identifier for this field. Used as the key in form values and error maps. */
  id: string;
  /** The field type that determines which component renders this question. */
  type: QuestionType;
  /** Display label shown above the field input. */
  label: string;
  /** Optional helper text displayed below the field. */
  helpText?: string;
  /** Optional placeholder text inside the input. */
  placeholder?: string;
  /** Whether the field is required. Can be a boolean or a conditional expression. */
  required?: boolean | ConditionExpression;
  /** Conditional expression that controls field visibility. Hidden fields are excluded from validation and submission. */
  showIf?: ConditionExpression;
  /** Whether the field is disabled. Can be a boolean or a conditional expression. */
  disabled?: boolean | ConditionExpression;
  /** Array of validation rules applied to this field's value. */
  validation?: ValidationRule[];
  /** Key used to match prefill data from URL params or props. */
  prefillKey?: string;
  /** Type-specific configuration object. Shape depends on the `type` field. */
  config?: QuestionConfig;
  /** Selectable options for choice-based fields (single_select, multi_select, dropdown, etc.). */
  options?: Option[];
  /** Layout configuration for this field (width, columns, custom CSS). */
  layout?: QuestionLayout;
  /** Escape hatch for passing arbitrary data to custom field type renderers. */
  customProps?: Record<string, unknown>;
};

/**
 * A selectable option for choice-based fields (single_select, multi_select, dropdown, ranking).
 *
 * @example
 * ```typescript
 * const options: Option[] = [
 *   { label: "Small", value: "sm" },
 *   { label: "Medium", value: "md" },
 *   { label: "Large", value: "lg", helpText: "Most popular" },
 *   { label: "None of the above", value: "none", exclusive: true },
 * ];
 * ```
 *
 * @since 1.0.0
 */
export type Option = {
  /** Display text shown to the user. */
  label: string;
  /** Value stored in form data when this option is selected. */
  value: string | number | boolean;
  /** Optional helper text displayed alongside the option. */
  helpText?: string;
  /** Optional icon identifier for the option. */
  icon?: string;
  /** If true, selecting this option deselects all others (for multi_select). */
  exclusive?: boolean;
};

/**
 * Layout configuration for an individual question/field.
 *
 * @since 1.0.0
 */
export type QuestionLayout = {
  /** Width of the field: "full" (100%), "half" (50%), or "third" (33%). */
  width?: "full" | "half" | "third";
  /** Number of columns for option-based fields (e.g., radio groups). */
  columns?: number;
  /** Custom CSS class name applied to the field wrapper. Must use `fc-` prefix. */
  className?: string;
  /** Inline styles applied to the field wrapper. */
  style?: Record<string, string>;
};

/**
 * Configuration for how the form submits data.
 *
 * @description
 * - `"http"` — POST/PUT/PATCH to a URL with optional headers.
 * - `"callback"` — invokes the `onSubmit` callback passed to the renderer.
 * - `"adapter"` — routes through registered `SubmitAdapter` instances.
 *
 * @since 1.0.0
 */
export type SubmitAction = {
  /** Submission method. */
  type: "http" | "callback" | "adapter";
  /** Target URL for HTTP submission. Required when `type` is "http". */
  url?: string;
  /** HTTP method. Defaults to "POST". */
  method?: "POST" | "PUT" | "PATCH";
  /** Additional HTTP headers sent with the request. */
  headers?: Record<string, string>;
};

/**
 * Configuration for what happens after successful form submission.
 *
 * @since 1.0.0
 */
export type CompleteAction = {
  /** Post-submission behavior. */
  type: "redirect" | "message" | "callback";
  /** Redirect URL. Required when `type` is "redirect". */
  url?: string;
  /** Success message text. Used when `type` is "message". */
  message?: string;
  /** Whether to show a summary of submitted values on the completion screen. */
  showSummary?: boolean;
};

/**
 * Branching rules evaluated when a user exits a section. Enables conditional
 * navigation (skip logic) based on field values.
 *
 * @example
 * ```typescript
 * const exitAction: SectionExitAction = {
 *   rules: [
 *     { condition: { field: "type", operator: "eq", value: "enterprise" }, jumpTo: "enterprise-details" },
 *   ],
 *   default: "general-details",
 * };
 * ```
 *
 * @since 1.0.0
 */
export type SectionExitAction = {
  /** Ordered list of conditional jump rules. First matching rule wins. */
  rules: JumpRule[];
  /** Section ID to jump to if no rules match. Falls through to next section if omitted. */
  default?: string;
};

/**
 * A single conditional jump rule within a `SectionExitAction`.
 *
 * @since 1.0.0
 */
export type JumpRule = {
  /** Condition that must be true for this jump to activate. */
  condition: ConditionExpression;
  /** Section ID to navigate to when the condition is met. */
  jumpTo: string;
};
