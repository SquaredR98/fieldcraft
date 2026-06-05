// @squaredr/fieldcraft-core
// Headless TypeScript form engine — zero UI dependencies

// Dev console banner — runs once in development mode
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (typeof globalThis !== "undefined" && typeof (globalThis as any).process !== "undefined" && (globalThis as any).process.env?.NODE_ENV !== "production") {
  const _fc_banner = `\n%c FieldCraft Core %c v1.3.4 \n\n%cDocs      → https://squaredr.tech/products/fieldcraft/docs\nGitHub    → https://github.com/AkshayBandi027/formengine\nDiscord   → https://discord.gg/zMxdu5UVW\nPro Tools → https://squaredr.tech/products/fieldcraft/admin-pro\n`;
  console.log(
    _fc_banner,
    "background:#2563eb;color:#fff;font-weight:bold;padding:2px 6px;border-radius:3px 0 0 3px",
    "background:#1e40af;color:#fff;padding:2px 6px;border-radius:0 3px 3px 0",
    "color:#6b7280"
  );
}

// Types — Schema
export type {
  FormEngineSchema,
  Section,
  Question,
  Option,
  QuestionLayout,
  BrandingConfig,
  SubmitAction,
  CompleteAction,
  SectionExitAction,
  JumpRule,
} from "./types/schema";

// Types — Question Types + Configs
export type {
  QuestionType,
  QuestionConfig,
  ShortTextConfig,
  LongTextConfig,
  NumberConfig,
  SliderConfig,
  RatingConfig,
  NpsConfig,
  LikertConfig,
  OpinionScaleConfig,
  SingleSelectConfig,
  MultiSelectConfig,
  DropdownConfig,
  BooleanConfig,
  CountrySelectConfig,
  RankingConfig,
  DateConfig,
  DateRangeConfig,
  TimeConfig,
  AppointmentConfig,
  FileUploadConfig,
  SignatureConfig,
  ImageCaptureConfig,
  AddressConfig,
  PaymentConfig,
  MatrixConfig,
  RepeaterConfig,
  CalculatedConfig,
  HiddenConfig,
  ScoringConfig,
  ConsentConfig,
  InfoBlockConfig,
  SectionHeaderConfig,
  PageBreakConfig,
  PhoneInternationalConfig,
  LegalNameConfig,
  WelcomeScreenConfig,
  ThankYouScreenConfig,
  RichTextConfig,
  ImageConfig,
  VideoConfig,
  DividerConfig,
  SpacerConfig,
} from "./types/question-types";

// Types — Conditions
export type { ConditionExpression, ConditionOperator } from "./types/conditions";

// Types — Validation
export type { ValidationRule, CustomValidator, AsyncValidator } from "./types/validation";

// Types — Settings
export type { FormSettings, PrefillConfig } from "./types/settings";

// Types — State
export type { FormState } from "./types/state";

// Types — Adapters
export type {
  SubmitAdapter,
  DraftAdapter,
  DraftData,
  AnalyticsAdapter,
  SchemaAdapter,
  SchemaListItem,
  SchemaListParams,
  SchemaListResult,
} from "./types/adapters";

// Types — Response
export type { FormResponse, SubmitResult } from "./types/response";

// Types — Theme
export type { FormEngineTheme } from "./types/theme";

// Engine
export { createEngine } from "./engine/create-engine";
export type { FormEngine, EngineOptions, ValidationResult } from "./engine/create-engine";

// Adapters
export { createHttpAdapter } from "./adapters/http-adapter";
export type { HttpAdapterConfig } from "./adapters/http-adapter";
export { createHttpSchemaAdapter } from "./adapters/http-schema-adapter";
export type { HttpSchemaAdapterConfig } from "./adapters/http-schema-adapter";

// Schema Validation
export { validateSchema, FormEngineSchemaError } from "./schema/schema-validator";

// Utils
export { deepEqual } from "./utils/deep-equal";
export { generateSessionToken } from "./utils/session-token";
