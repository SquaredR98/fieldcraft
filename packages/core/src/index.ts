// @squaredr/fieldcraft-core
// Headless TypeScript form engine — zero UI dependencies

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
  PhoneInternationalConfig,
  LegalNameConfig,
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
export type { SubmitAdapter, DraftAdapter, DraftData, AnalyticsAdapter } from "./types/adapters";

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

// Schema Validation
export { validateSchema, FormEngineSchemaError } from "./schema/schema-validator";

// Utils
export { deepEqual } from "./utils/deep-equal";
export { generateSessionToken } from "./utils/session-token";
