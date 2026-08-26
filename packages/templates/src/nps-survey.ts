import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const npsSurveySchema: FormEngineSchema = {
  id: "nps-survey",
  version: "1.0.0",
  title: "Net Promoter Score Survey",
  description: "Quick NPS survey with smart follow-up questions based on score.",
  settings: {
    showProgress: true,
    progressStyle: "steps",
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "score",
      title: "Your Rating",
      description: "One quick question to start",
      questions: [
        {
          id: "nps_score",
          type: "nps",
          label: "How likely are you to recommend us to a friend or colleague?",
          required: true,
        },
        {
          id: "detractor_reason",
          type: "single_select",
          label: "We're sorry to hear that. What's the biggest issue?",
          required: true,
          showIf: {
            field: "nps_score",
            operator: "lte",
            value: 6,
          },
          options: [
            { label: "Product quality", value: "quality" },
            { label: "Customer support", value: "support" },
            { label: "Pricing", value: "pricing" },
            { label: "Missing features", value: "features" },
            { label: "Bugs / reliability", value: "bugs" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "promoter_reason",
          type: "single_select",
          label: "Awesome! What do you love most?",
          required: true,
          showIf: {
            field: "nps_score",
            operator: "gte",
            value: 9,
          },
          options: [
            { label: "Ease of use", value: "ease" },
            { label: "Features", value: "features" },
            { label: "Performance", value: "performance" },
            { label: "Customer support", value: "support" },
            { label: "Value for money", value: "value" },
            { label: "Other", value: "other" },
          ],
        },
      ],
    },
    {
      id: "details",
      title: "Tell Us More",
      description: "Optional — help us understand your experience better",
      questions: [
        {
          id: "comment",
          type: "long_text",
          label: "Anything else you'd like to share?",
          required: false,
          placeholder: "Your thoughts...",
          validation: [{ type: "maxLength", value: 500 }],
        },
        {
          id: "email",
          type: "email",
          label: "Email (if you'd like us to follow up)",
          required: false,
          placeholder: "you@company.com",
        },
      ],
    },
  ],
};

export const npsSurveyMeta = {
  id: "nps-survey",
  name: "NPS Survey",
  description:
    "A focused Net Promoter Score survey with conditional follow-up questions. Detractors see different questions than promoters, with smart branching logic.",
  category: "feedback" as const,
  fieldCount: 5,
  sectionCount: 2,
  tags: ["nps", "survey", "conditional-logic", "feedback"],
};

export const npsSurvey: Template = {
  meta: npsSurveyMeta,
  schema: npsSurveySchema,
};
