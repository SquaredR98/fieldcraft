import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export type TemplateCategory =
  | "general"
  | "feedback"
  | "marketing"
  | "support";

export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  fieldCount: number;
  sectionCount: number;
  tags: string[];
};

export type Template = {
  meta: TemplateMeta;
  schema: FormEngineSchema;
};
