// Question type union + type-specific configs
// See docs/prd-m1-core-engine.md §2.2 for full config definitions
//
// Note: RepeaterConfig.fields uses a generic type to avoid circular import
// with schema.ts. At runtime, it holds Question[] objects.

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

// ---- Type-specific configs ----

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

export type ShortTextConfig = {
  type: "short_text";
  maxLength?: number;
  inputType?: "text" | "password";
  prefix?: string;
  suffix?: string;
};

export type LongTextConfig = {
  type: "long_text";
  maxLength?: number;
  rows?: number;
  showCharCount?: boolean;
};

// ---- Numeric ----

export type NumberConfig = {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
};

export type SliderConfig = {
  type: "slider";
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
  minLabel?: string;
  maxLabel?: string;
};

export type RatingConfig = {
  type: "rating";
  max: number;
  icon?: "star" | "heart" | "circle";
  showLabels?: boolean;
};

export type NpsConfig = {
  type: "nps";
  lowLabel?: string;
  highLabel?: string;
};

export type LikertConfig = {
  type: "likert";
  labels: string[];
};

export type OpinionScaleConfig = {
  type: "opinion_scale";
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
  step?: number;
};

// ---- Selection ----

export type SingleSelectConfig = {
  type: "single_select";
  layout?: "vertical" | "horizontal" | "grid";
  allowOther?: boolean;
  otherLabel?: string;
};

export type MultiSelectConfig = {
  type: "multi_select";
  layout?: "vertical" | "horizontal" | "grid";
  minSelections?: number;
  maxSelections?: number;
  allowOther?: boolean;
  otherLabel?: string;
};

export type DropdownConfig = {
  type: "dropdown";
  searchable?: boolean;
  allowOther?: boolean;
  multiple?: boolean;
};

export type BooleanConfig = {
  type: "boolean";
  style?: "toggle" | "radio" | "checkbox";
  trueLabel?: string;
  falseLabel?: string;
};

export type CountrySelectConfig = {
  type: "country_select";
  showFlags?: boolean;
  priorityCountries?: string[];
  excludeCountries?: string[];
};

export type RankingConfig = {
  type: "ranking";
  items: { label: string; value: string }[];
};

// ---- Date & Time ----

export type DateConfig = {
  type: "date";
  minDate?: string;
  maxDate?: string;
  disablePast?: boolean;
  disableFuture?: boolean;
  format?: string;
};

export type DateRangeConfig = {
  type: "date_range";
  minDate?: string;
  maxDate?: string;
  maxRangeDays?: number;
};

export type TimeConfig = {
  type: "time";
  format?: "12h" | "24h";
  minuteStep?: number;
};

export type AppointmentConfig = {
  type: "appointment";
  slotsUrl?: string;
  slots?: { date: string; times: string[] }[];
  timezone?: string;
  duration?: number;
};

// ---- Media & Input ----

export type FileUploadConfig = {
  type: "file_upload";
  accept?: string[];
  maxSizeMb?: number;
  maxFiles?: number;
  uploadUrl?: string;
};

export type SignatureConfig = {
  type: "signature";
  penColor?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
};

export type ImageCaptureConfig = {
  type: "image_capture";
  maxSizeMb?: number;
  camera?: "front" | "back" | "any";
  allowGallery?: boolean;
};

// ---- Advanced ----

export type AddressConfig = {
  type: "address";
  provider?: "google" | "mapbox" | "none";
  apiKey?: string;
  fields?: ("street" | "street2" | "city" | "state" | "zip" | "country")[];
  defaultCountry?: string;
};

export type PaymentConfig = {
  type: "payment";
  provider: "stripe" | "paypal";
  publicKey: string;
  amount?: number;
  amountField?: string;
  currency?: string;
  description?: string;
};

export type MatrixConfig = {
  type: "matrix";
  rows: { label: string; value: string }[];
  columns: { label: string; value: string }[];
  inputType?: "radio" | "checkbox" | "text" | "number";
  required?: "all" | "any" | "none";
};

export type RepeaterConfig = {
  type: "repeater";
  /** Sub-questions for each repeater entry. Typed as unknown[] to avoid circular import — holds Question[] at runtime. */
  fields: unknown[];
  minEntries?: number;
  maxEntries?: number;
  addLabel?: string;
  removeLabel?: string;
  defaultEntries?: number;
};

export type CalculatedConfig = {
  type: "calculated";
  expression: string;
  format?: "number" | "currency" | "percentage";
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  visible?: boolean;
};

export type HiddenConfig = {
  type: "hidden";
  defaultValue?: unknown;
  source?: "url_param" | "cookie" | "referrer" | "static";
  paramName?: string;
  cookieName?: string;
};

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

export type ConsentConfig = {
  type: "consent";
  text: string;
  expandableText?: string;
  checkboxLabel?: string;
};

export type InfoBlockConfig = {
  type: "info_block";
  content: string;
  variant?: "info" | "warning" | "success" | "error";
};

export type SectionHeaderConfig = {
  type: "section_header";
  level?: "h2" | "h3" | "h4";
  showDivider?: boolean;
};

export type PageBreakConfig = {
  type: "page_break";
  label?: string;
};

// ---- Additional Text Types ----

export type PhoneInternationalConfig = {
  type: "phone_international";
  defaultCountry?: string;
  priorityCountries?: string[];
};

export type LegalNameConfig = {
  type: "legal_name";
  showMiddleName?: boolean;
  showSuffix?: boolean;
};

// ---- Content & Visual ----

export type WelcomeScreenConfig = {
  type: "welcome-screen";
  heading: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  buttonText?: string; // default: "Start"
  alignment?: "left" | "center" | "right";
};

export type ThankYouScreenConfig = {
  type: "thank-you-screen";
  heading: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  redirectUrl?: string;
  redirectDelay?: number; // seconds, 0 = no redirect
  showSummary?: boolean;
};

export type RichTextConfig = {
  type: "rich-text";
  content: string;
  format: "markdown" | "html";
  containerClassName?: string;
  containerStyle?: Record<string, string>;
};

export type ImageConfig = {
  type: "image";
  src: string;
  alt: string;
  width?: string; // "100%", "300px", etc.
  height?: string;
  alignment?: "left" | "center" | "right";
  caption?: string;
  link?: string; // click opens this URL
};

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

export type DividerConfig = {
  type: "divider";
  style?: "solid" | "dashed" | "dotted";
  color?: string;
  thickness?: number; // px, default 1
  spacing?: number; // vertical margin in px, default 16
};

export type SpacerConfig = {
  type: "spacer";
  height: number; // px
};
