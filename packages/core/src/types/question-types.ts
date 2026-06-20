/**
 * Union of all supported question/field type identifiers.
 *
 * @description Each value maps to a registered field component in the React renderer.
 * The trailing `(string & {})` allows custom types registered via field registry
 * while preserving autocomplete for built-in types.
 *
 * @since 1.0.0
 */
export type QuestionType =
  // Text
  | "short_text"
  | "long_text"
  | "email"
  | "phone"
  | "phone_international"
  | "url"
  | "legal_name"
  // Numeric
  | "number"
  | "slider"
  | "rating"
  | "nps"
  | "likert"
  | "opinion_scale"
  // Selection
  | "single_select"
  | "multi_select"
  | "dropdown"
  | "boolean"
  | "country_select"
  | "ranking"
  // Date & Time
  | "date"
  | "date_range"
  | "time"
  | "appointment"
  // Media & Input
  | "file_upload"
  | "signature"
  | "image_capture"
  // Advanced
  | "address"
  | "payment"
  | "matrix"
  | "repeater"
  | "calculated"
  | "hidden"
  | "scoring"
  // Structural
  | "section_header"
  | "consent"
  | "info_block"
  | "page_break"
  // Content & Visual (non-input — no values collected)
  | "welcome-screen"
  | "thank-you-screen"
  | "rich-text"
  | "image"
  | "video"
  | "divider"
  | "spacer"
  // Extensible — vertical packs register custom types
  | (string & {});

/**
 * Discriminated union of all type-specific question configuration objects.
 * Set on `Question.config` — the shape depends on `Question.type`.
 *
 * @since 1.0.0
 */
export type QuestionConfig =
  | ShortTextConfig
  | LongTextConfig
  | NumberConfig
  | SliderConfig
  | RatingConfig
  | NpsConfig
  | LikertConfig
  | OpinionScaleConfig
  | SingleSelectConfig
  | MultiSelectConfig
  | DropdownConfig
  | BooleanConfig
  | CountrySelectConfig
  | RankingConfig
  | DateConfig
  | DateRangeConfig
  | TimeConfig
  | AppointmentConfig
  | FileUploadConfig
  | SignatureConfig
  | ImageCaptureConfig
  | AddressConfig
  | PaymentConfig
  | MatrixConfig
  | RepeaterConfig
  | CalculatedConfig
  | HiddenConfig
  | ScoringConfig
  | ConsentConfig
  | InfoBlockConfig
  | SectionHeaderConfig
  | PageBreakConfig
  | PhoneInternationalConfig
  | LegalNameConfig
  | WelcomeScreenConfig
  | ThankYouScreenConfig
  | RichTextConfig
  | ImageConfig
  | VideoConfig
  | DividerConfig
  | SpacerConfig;

// ---- Text ----

/** Config for `short_text` fields. Single-line text input. @since 1.0.0 */
export type ShortTextConfig = {
  type: "short_text";
  maxLength?: number;
  inputType?: "text" | "password";
  prefix?: string;
  suffix?: string;
};

/** Config for `long_text` fields. Multi-line textarea. @since 1.0.0 */
export type LongTextConfig = {
  type: "long_text";
  maxLength?: number;
  rows?: number;
  showCharCount?: boolean;
};

// ---- Numeric ----

/** Config for `number` fields. Numeric input with optional step and formatting. @since 1.0.0 */
export type NumberConfig = {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
};

/** Config for `slider` fields. Range slider with min/max bounds. @since 1.0.0 */
export type SliderConfig = {
  type: "slider";
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
  minLabel?: string;
  maxLabel?: string;
};

/** Config for `rating` fields. Star/heart/circle rating selector. @since 1.0.0 */
export type RatingConfig = {
  type: "rating";
  max: number;
  icon?: "star" | "heart" | "circle";
  showLabels?: boolean;
};

/** Config for `nps` fields. Net Promoter Score (0–10) selector. @since 1.0.0 */
export type NpsConfig = {
  type: "nps";
  lowLabel?: string;
  highLabel?: string;
};

/** Config for `likert` fields. Agreement scale with custom labels. @since 1.0.0 */
export type LikertConfig = {
  type: "likert";
  labels: string[];
};

/** Config for `opinion_scale` fields. Numeric scale with labeled endpoints. @since 1.0.0 */
export type OpinionScaleConfig = {
  type: "opinion_scale";
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
  step?: number;
};

// ---- Selection ----

/** Config for `single_select` fields. Radio button group with optional "Other" input. @since 1.0.0 */
export type SingleSelectConfig = {
  type: "single_select";
  layout?: "vertical" | "horizontal" | "grid";
  allowOther?: boolean;
  otherLabel?: string;
};

/** Config for `multi_select` fields. Checkbox group with optional min/max selections. @since 1.0.0 */
export type MultiSelectConfig = {
  type: "multi_select";
  layout?: "vertical" | "horizontal" | "grid";
  minSelections?: number;
  maxSelections?: number;
  allowOther?: boolean;
  otherLabel?: string;
};

/** Config for `dropdown` fields. Select menu with optional search and multi-select. @since 1.0.0 */
export type DropdownConfig = {
  type: "dropdown";
  searchable?: boolean;
  allowOther?: boolean;
  multiple?: boolean;
};

/** Config for `boolean` fields. Yes/no toggle, radio, or checkbox. @since 1.0.0 */
export type BooleanConfig = {
  type: "boolean";
  style?: "toggle" | "radio" | "checkbox";
  trueLabel?: string;
  falseLabel?: string;
};

/** Config for `country_select` fields. Country picker with flags and priority ordering. @since 1.0.0 */
export type CountrySelectConfig = {
  type: "country_select";
  showFlags?: boolean;
  priorityCountries?: string[];
  excludeCountries?: string[];
};

/** Config for `ranking` fields. Drag-to-reorder list of items. @since 1.0.0 */
export type RankingConfig = {
  type: "ranking";
  items: { label: string; value: string }[];
};

// ---- Date & Time ----

/** Config for `date` fields. Date picker with optional min/max constraints. @since 1.0.0 */
export type DateConfig = {
  type: "date";
  minDate?: string;
  maxDate?: string;
  disablePast?: boolean;
  disableFuture?: boolean;
  format?: string;
};

/** Config for `date_range` fields. Start + end date picker. @since 1.0.0 */
export type DateRangeConfig = {
  type: "date_range";
  minDate?: string;
  maxDate?: string;
  maxRangeDays?: number;
};

/** Config for `time` fields. Time picker with 12h/24h format. @since 1.0.0 */
export type TimeConfig = {
  type: "time";
  format?: "12h" | "24h";
  minuteStep?: number;
};

/** Config for `appointment` fields. Date + time slot picker with availability. @since 1.0.0 */
export type AppointmentConfig = {
  type: "appointment";
  slotsUrl?: string;
  slots?: { date: string; times: string[] }[];
  timezone?: string;
  duration?: number;
};

// ---- Media & Input ----

/** Config for `file_upload` fields. File input with type/size constraints. @since 1.0.0 */
export type FileUploadConfig = {
  type: "file_upload";
  accept?: string[];
  maxSizeMb?: number;
  maxFiles?: number;
  uploadUrl?: string;
};

/** Config for `signature` fields. Canvas-based signature pad. @since 1.0.0 */
export type SignatureConfig = {
  type: "signature";
  penColor?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
};

/** Config for `image_capture` fields. Camera capture with gallery fallback. @since 1.0.0 */
export type ImageCaptureConfig = {
  type: "image_capture";
  maxSizeMb?: number;
  camera?: "front" | "back" | "any";
  allowGallery?: boolean;
};

// ---- Advanced ----

/** Config for `address` fields. Structured address input with optional autocomplete. @since 1.0.0 */
export type AddressConfig = {
  type: "address";
  provider?: "google" | "mapbox" | "none";
  apiKey?: string;
  fields?: ("street" | "street2" | "city" | "state" | "zip" | "country")[];
  defaultCountry?: string;
};

/** Config for `payment` fields. Stripe or PayPal payment collection. @since 1.0.0 */
export type PaymentConfig = {
  type: "payment";
  provider: "stripe" | "paypal";
  publicKey: string;
  amount?: number;
  amountField?: string;
  currency?: string;
  description?: string;
};

/** Config for `matrix` fields. Grid of rows x columns (radio, checkbox, or text inputs). @since 1.0.0 */
export type MatrixConfig = {
  type: "matrix";
  rows: { label: string; value: string }[];
  columns: { label: string; value: string }[];
  inputType?: "radio" | "checkbox" | "text" | "number";
  required?: "all" | "any" | "none";
};

/**
 * Config for `repeater` fields. Dynamic list where users add/remove entries,
 * each containing the same set of sub-questions.
 *
 * @since 1.0.0
 */
export type RepeaterConfig = {
  type: "repeater";
  /** Sub-questions for each repeater entry. Typed as `unknown[]` to avoid circular import — holds `Question[]` at runtime. */
  fields: unknown[];
  minEntries?: number;
  maxEntries?: number;
  addLabel?: string;
  removeLabel?: string;
  defaultEntries?: number;
};

/** Config for `calculated` fields. Displays a computed value from an expression. @since 1.0.0 */
export type CalculatedConfig = {
  type: "calculated";
  /** Expression string using field references (e.g., `"{quantity} * {price}"`). */
  expression: string;
  format?: "number" | "currency" | "percentage";
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  visible?: boolean;
};

/** Config for `hidden` fields. Invisible fields that capture metadata. @since 1.0.0 */
export type HiddenConfig = {
  type: "hidden";
  defaultValue?: unknown;
  source?: "url_param" | "cookie" | "referrer" | "static";
  paramName?: string;
  cookieName?: string;
};

/** Config for `scoring` fields. Options with numeric scores and result ranges. @since 1.0.0 */
export type ScoringConfig = {
  type: "scoring";
  options: {
    label: string;
    value: string;
    score: number;
  }[];
  showScore?: boolean;
  scoreRanges?: {
    min: number;
    max: number;
    label: string;
    color?: string;
    description?: string;
  }[];
};

// ---- Structural ----

/** Config for `consent` fields. Checkbox with expandable legal text. @since 1.0.0 */
export type ConsentConfig = {
  type: "consent";
  text: string;
  expandableText?: string;
  checkboxLabel?: string;
};

/** Config for `info_block` fields. Static informational message. Non-input — no value collected. @since 1.0.0 */
export type InfoBlockConfig = {
  type: "info_block";
  content: string;
  variant?: "info" | "warning" | "success" | "error";
};

/** Config for `section_header` fields. Visual heading within a section. Non-input. @since 1.0.0 */
export type SectionHeaderConfig = {
  type: "section_header";
  level?: "h2" | "h3" | "h4";
  showDivider?: boolean;
};

/** Config for `page_break` fields. Forces a visual break within a section. Non-input. @since 1.0.0 */
export type PageBreakConfig = {
  type: "page_break";
  label?: string;
};

// ---- Additional Text Types ----

/** Config for `phone_international` fields. Phone input with country code selector. @since 1.0.0 */
export type PhoneInternationalConfig = {
  type: "phone_international";
  defaultCountry?: string;
  priorityCountries?: string[];
};

/** Config for `legal_name` fields. Structured first/middle/last name input. @since 1.0.0 */
export type LegalNameConfig = {
  type: "legal_name";
  showMiddleName?: boolean;
  showSuffix?: boolean;
};

// ---- Content & Visual ----

/** Config for `welcome-screen` fields. Intro screen shown before form questions. Non-input. @since 1.0.0 */
export type WelcomeScreenConfig = {
  type: "welcome-screen";
  heading: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Label for the start button. Defaults to "Start". */
  buttonText?: string;
  alignment?: "left" | "center" | "right";
};

/** Config for `thank-you-screen` fields. Completion screen after submission. Non-input. @since 1.0.0 */
export type ThankYouScreenConfig = {
  type: "thank-you-screen";
  heading: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  redirectUrl?: string;
  /** Seconds before redirect. 0 = no auto-redirect. */
  redirectDelay?: number;
  showSummary?: boolean;
};

/** Config for `rich-text` fields. Rendered markdown or HTML content block. Non-input. @since 1.0.0 */
export type RichTextConfig = {
  type: "rich-text";
  content: string;
  format: "markdown" | "html";
  containerClassName?: string;
  containerStyle?: Record<string, string>;
};

/** Config for `image` fields. Static image display with optional caption and link. Non-input. @since 1.0.0 */
export type ImageConfig = {
  type: "image";
  src: string;
  alt: string;
  width?: string;
  height?: string;
  alignment?: "left" | "center" | "right";
  caption?: string;
  /** URL opened when the image is clicked. */
  link?: string;
};

/** Config for `video` fields. Embedded video from YouTube, Vimeo, or direct URL. Non-input. @since 1.0.0 */
export type VideoConfig = {
  type: "video";
  src: string;
  provider: "youtube" | "vimeo" | "url";
  autoplay?: boolean;
  muted?: boolean;
  poster?: string;
  width?: string;
  height?: string;
};

/** Config for `divider` fields. Horizontal rule with configurable style. Non-input. @since 1.0.0 */
export type DividerConfig = {
  type: "divider";
  style?: "solid" | "dashed" | "dotted";
  color?: string;
  /** Line thickness in pixels. Defaults to 1. */
  thickness?: number;
  /** Vertical margin in pixels. Defaults to 16. */
  spacing?: number;
};

/** Config for `spacer` fields. Empty vertical space. Non-input. @since 1.0.0 */
export type SpacerConfig = {
  type: "spacer";
  /** Height in pixels. */
  height: number;
};
