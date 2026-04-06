// Root schema types — see docs/prd-m1-core-engine.md §2.2 for full spec

import type { QuestionType, QuestionConfig } from "./question-types";
import type { ConditionExpression } from "./conditions";
import type { ValidationRule } from "./validation";
import type { FormSettings } from "./settings";

export type FormEngineSchema = {
  id: string;
  version: string;
  title: string;
  description?: string;
  branding?: BrandingConfig;
  settings?: FormSettings;
  sections: Section[];
  submitAction: SubmitAction;
  onComplete?: CompleteAction;
};

export type BrandingConfig = {
  logoUrl?: string;
  logoAlt?: string;
  faviconUrl?: string;
  poweredBy?: boolean;
};

export type Section = {
  id: string;
  title: string;
  description?: string;
  showIf?: ConditionExpression;
  questions: Question[];
  onExit?: SectionExitAction;
};

export type Question = {
  id: string;
  type: QuestionType;
  label: string;
  helpText?: string;
  placeholder?: string;
  required?: boolean | ConditionExpression;
  showIf?: ConditionExpression;
  disabled?: boolean | ConditionExpression;
  validation?: ValidationRule[];
  prefillKey?: string;
  config?: QuestionConfig;
  options?: Option[];
  layout?: QuestionLayout;
};

export type Option = {
  label: string;
  value: string | number | boolean;
  helpText?: string;
  icon?: string;
  exclusive?: boolean;
};

export type QuestionLayout = {
  width?: "full" | "half" | "third";
  columns?: number;
};

export type SubmitAction = {
  type: "http" | "callback" | "adapter";
  url?: string;
  method?: "POST" | "PUT" | "PATCH";
  headers?: Record<string, string>;
};

export type CompleteAction = {
  type: "redirect" | "message" | "callback";
  url?: string;
  message?: string;
  showSummary?: boolean;
};

export type SectionExitAction = {
  rules: JumpRule[];
  default?: string;
};

export type JumpRule = {
  condition: ConditionExpression;
  jumpTo: string;
};
