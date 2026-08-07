import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export const numericFieldsDemo: FormEngineSchema = {
  id: "numeric-fields-demo",
  version: "1.0.0",
  title: "Numeric & Rating Fields",
  description: "Demonstrates all numeric fields: number, slider, rating, NPS, Likert scale, and opinion scale.",
  settings: {
    showProgress: true,
    progressStyle: "bar",
  },
  sections: [
    {
      id: "basic-numeric",
      title: "Numeric Inputs",
      questions: [
        {
          id: "number_example",
          type: "number",
          label: "Years of Experience",
          required: true,
          helpText: "Plain number input with min/max validation",
          validation: [
            { type: "min", value: 0 },
            { type: "max", value: 50 },
          ],
        },
        {
          id: "slider_example",
          type: "slider",
          label: "Budget Range ($)",
          required: false,
          helpText: "Slider with min/max range",
          validation: [
            { type: "min", value: 0 },
            { type: "max", value: 10000 },
          ],
        },
      ],
    },
    {
      id: "ratings",
      title: "Ratings & Scales",
      questions: [
        {
          id: "rating_example",
          type: "rating",
          label: "Rate Our Documentation",
          required: true,
          helpText: "Star rating (1-5)",
        },
        {
          id: "nps_example",
          type: "nps",
          label: "How likely are you to recommend us?",
          required: true,
          helpText: "Net Promoter Score (0-10). 0 = Not at all likely, 10 = Extremely likely",
        },
        {
          id: "likert_example",
          type: "likert",
          label: "This product meets my needs",
          required: true,
          helpText: "Likert scale from Strongly Disagree to Strongly Agree",
        },
        {
          id: "opinion_scale_example",
          type: "opinion_scale",
          label: "How satisfied are you overall?",
          required: false,
          helpText: "Opinion scale (1-10)",
        },
      ],
    },
  ],
  submitAction: { type: "callback" },
};
