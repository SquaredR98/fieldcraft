import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const pollSchema: FormEngineSchema = {
  id: "poll",
  version: "1.0.0",
  title: "Quick Poll",
  description: "Share your opinion — takes less than a minute.",
  settings: {
    showProgress: false,
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "poll-questions",
      title: "Share Your Opinion",
      questions: [
        {
          id: "main_question",
          type: "single_select",
          label: "What's the most important factor when choosing a SaaS tool?",
          required: true,
          options: [
            { label: "Ease of use", value: "ease-of-use" },
            { label: "Price / value", value: "price" },
            { label: "Features & capabilities", value: "features" },
            { label: "Integrations", value: "integrations" },
            { label: "Customer support", value: "support" },
            { label: "Security & compliance", value: "security" },
          ],
        },
        {
          id: "satisfaction",
          type: "rating",
          label: "How satisfied are you with your current tools?",
          required: true,
        },
        {
          id: "switch_likelihood",
          type: "opinion_scale",
          label: "How likely are you to switch tools in the next 6 months?",
          required: false,
          config: {
            type: "opinion_scale",
            min: 1,
            max: 5,
            minLabel: "Very unlikely",
            maxLabel: "Very likely",
          },
        },
        {
          id: "open_feedback",
          type: "long_text",
          label: "Any other thoughts?",
          required: false,
          placeholder: "Optional — share anything else on your mind",
          validation: [{ type: "maxLength", value: 500 }],
        },
        {
          id: "email",
          type: "email",
          label: "Email (to see poll results)",
          required: false,
          placeholder: "you@email.com",
          helpText: "Optional — we'll send you the results when the poll closes",
        },
      ],
    },
  ],
};

export const pollMeta = {
  id: "poll",
  name: "Quick Poll",
  description:
    "A single-section poll with a main question, satisfaction rating, opinion scale, optional open feedback, and email for results. Designed for quick engagement.",
  category: "general" as const,
  fieldCount: 5,
  sectionCount: 1,
  tags: ["poll", "survey", "quick", "opinion", "engagement"],
};

export const poll: Template = {
  meta: pollMeta,
  schema: pollSchema,
};
