import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const feedbackSurveySchema: FormEngineSchema = {
  id: "feedback-survey",
  version: "1.0.0",
  title: "Customer Feedback Survey",
  description:
    "Help us improve by sharing your experience. Takes about 3 minutes.",
  settings: {
    showProgress: true,
    progressStyle: "percentage",
    navigation: {
      showBack: true,
      allowSkip: false,
    },
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "satisfaction",
      title: "Overall Satisfaction",
      description: "Rate your overall experience with our product",
      questions: [
        {
          id: "nps_score",
          type: "nps",
          label: "How likely are you to recommend us to a friend or colleague?",
          required: true,
        },
        {
          id: "overall_rating",
          type: "rating",
          label: "Overall satisfaction with our product",
          required: true,
        },
        {
          id: "nps_reason",
          type: "long_text",
          label: "What's the main reason for your score?",
          required: false,
          placeholder: "Tell us what influenced your rating...",
          validation: [{ type: "maxLength", value: 500 }],
        },
      ],
    },
    {
      id: "specifics",
      title: "Product Experience",
      description: "Tell us about specific aspects of the product",
      questions: [
        {
          id: "ease_of_use",
          type: "likert",
          label: "The product is easy to use",
          required: true,
        },
        {
          id: "reliability",
          type: "likert",
          label: "The product is reliable and stable",
          required: true,
        },
        {
          id: "value_for_money",
          type: "likert",
          label: "The product provides good value for money",
          required: true,
        },
        {
          id: "features_used",
          type: "multi_select",
          label: "Which features do you use most frequently?",
          required: false,
          options: [
            { label: "Dashboard", value: "dashboard" },
            { label: "Analytics & Reports", value: "analytics" },
            { label: "Integrations", value: "integrations" },
            { label: "API", value: "api" },
            { label: "Mobile App", value: "mobile" },
            { label: "Automation", value: "automation" },
          ],
        },
        {
          id: "missing_feature",
          type: "single_select",
          label: "What would you most like us to add?",
          required: false,
          options: [
            { label: "Better reporting", value: "reporting" },
            { label: "More integrations", value: "integrations" },
            { label: "Improved performance", value: "performance" },
            { label: "Better documentation", value: "docs" },
            { label: "Lower pricing", value: "pricing" },
            { label: "Nothing — it's great", value: "none" },
          ],
        },
      ],
    },
    {
      id: "follow-up",
      title: "Final Thoughts",
      description: "Anything else you'd like to share?",
      questions: [
        {
          id: "improvement",
          type: "long_text",
          label: "If you could change one thing about our product, what would it be?",
          required: false,
          placeholder: "Your suggestion...",
          validation: [{ type: "maxLength", value: 1000 }],
        },
        {
          id: "can_contact",
          type: "boolean",
          label: "Can we follow up with you about your feedback?",
          required: false,
        },
        {
          id: "contact_email",
          type: "email",
          label: "Your email address",
          required: true,
          placeholder: "you@company.com",
          helpText: "We'll only use this to follow up on your feedback",
          showIf: {
            field: "can_contact",
            operator: "eq",
            value: true,
          },
        },
        {
          id: "subscribe",
          type: "boolean",
          label: "Keep me updated on product improvements",
          required: false,
          showIf: {
            field: "can_contact",
            operator: "eq",
            value: true,
          },
        },
      ],
    },
  ],
};

export const feedbackSurveyMeta = {
  id: "feedback-survey",
  name: "Feedback Survey",
  description:
    "A comprehensive customer feedback survey with NPS, ratings, Likert scales, feature usage tracking, and conditional follow-up. Three sections covering satisfaction, specifics, and open-ended feedback.",
  category: "feedback" as const,
  fieldCount: 12,
  sectionCount: 3,
  tags: ["feedback", "survey", "nps", "rating", "likert"],
};

export const feedbackSurvey: Template = {
  meta: feedbackSurveyMeta,
  schema: feedbackSurveySchema,
};
