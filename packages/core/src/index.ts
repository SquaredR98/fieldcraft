// @squaredr/fieldcraft-core
// Headless TypeScript form engine — zero UI dependencies

// Injected at build time by tsup from package.json
declare const __PKG_VERSION__: string;

// Dev console banner — runs once in development mode
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (typeof globalThis !== "undefined" && typeof (globalThis as any).process !== "undefined" && (globalThis as any).process.env?.NODE_ENV !== "production") {
  const _fc_banner = `\n%c FieldCraft Core %c v${__PKG_VERSION__}\n\n%cDocs      → https://fieldcraft.squaredr.tech/docs\nGitHub    → https://github.com/SquaredR98/fieldcraft\nDiscord   → https://discord.gg/FK8pszp5z\n`;
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
  RepeaterField,
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
export type { FieldCraftEvent, OnEventCallback } from "./engine/analytics-emitter";
export type { DraftSnapshot } from "./engine/draft-manager";
export type { VisibleQuestion } from "./engine/navigation";

// Adapters
export { createHttpAdapter } from "./adapters/http-adapter";
export type { HttpAdapterConfig } from "./adapters/http-adapter";
export { createHttpSchemaAdapter } from "./adapters/http-schema-adapter";
export type { HttpSchemaAdapterConfig } from "./adapters/http-schema-adapter";
export type { FormAdapter } from "./adapters/adapter-interface";

// Validator Registry
export { createValidatorRegistry } from "./validators/registry";
export type { ValidatorRegistry, ValidatorMetadata } from "./validators/registry";

// Schema Validation
export { validateSchema, FormEngineSchemaError } from "./schema/schema-validator";

// Data
export { COUNTRIES, type Country } from "./data/countries";
export { TIMEZONES, type Timezone } from "./data/timezones";

// Utils
export { deepEqual } from "./utils/deep-equal";
export { generateSessionToken } from "./utils/session-token";
export { exportFormData } from "./utils/export";
export type { ExportFormat } from "./utils/export";
export { evaluateFunction } from "./utils/expression-parser";
export {
  getFieldById,
  getAllFieldIds,
  getRequiredFieldIds,
  cloneSchema,
  mergeSchemas,
  createEmptySchema,
  schemaDiff,
  migrateSchema,
} from "./utils/schema-utils";
export type { SchemaDiff } from "./utils/schema-utils";
export { flattenFormValues, unflattenFormValues } from "./utils/form-utils";
export { validateResponse, formatResponseValues, flattenResponse } from "./utils/response-utils";
