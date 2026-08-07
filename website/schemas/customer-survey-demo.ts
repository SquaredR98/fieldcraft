import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export const customerSurveyDemo: FormEngineSchema = {
  id: "customer-survey-demo",
  version: "1.0.0",
  title: "Customer Satisfaction Survey",
  description: "A real-world customer feedback form with NPS, ratings, conditional follow-ups, and open-ended questions.",
  settings: {
    showProgress: true,
    progressStyle: "percentage",
  },
  sections: [
    {
      id: "overall",
      title: "Overall Experience",
      questions: [
        {
          id: "nps_score",
          type: "nps",
          label: "How likely are you to recommend us to a friend or colleague?",
          required: true,
        },
        {
          id: "nps_reason",
          type: "long_text",
          label: "What's the primary reason for your score?",
          required: false,
          helpText: "We'd love to understand what drove your rating",
          validation: [{ type: "maxLength", value: 500 }],
        },
        {
          id: "overall_rating",
          type: "rating",
          label: "Overall satisfaction with our product",
          required: true,
        },
      ],
    },
    {
      id: "specific",
      title: "Specific Feedback",
      questions: [
        {
          id: "ease_of_use",
          type: "likert",
          label: "The product is easy to use",
          required: true,
        },
        {
          id: "value_for_money",
          type: "likert",
          label: "The product provides good value for money",
          required: true,
        },
        {
          id: "customer_support",
          type: "likert",
          label: "Customer support is responsive and helpful",
          required: true,
        },
        {
          id: "most_used_features",
          type: "multi_select",
          label: "Which features do you use most?",
          required: false,
          options: [
            { label: "Dashboard", value: "dashboard" },
            { label: "Reports", value: "reports" },
            { label: "Integrations", value: "integrations" },
            { label: "API", value: "api" },
            { label: "Mobile App", value: "mobile" },
          ],
        },
      ],
    },
    {
      id: "improvements",
      title: "Improvements",
      questions: [
        {
          id: "biggest_issue",
          type: "single_select",
          label: "What is your biggest frustration?",
          required: false,
          options: [
            { label: "Performance / Speed", value: "performance" },
            { label: "Missing features", value: "features" },
            { label: "Bugs / Reliability", value: "bugs" },
            { label: "Pricing", value: "pricing" },
            { label: "Onboarding / Learning curve", value: "onboarding" },
            { label: "Nothing — I'm happy!", value: "none" },
          ],
        },
        {
          id: "improvement_suggestion",
          type: "long_text",
          label: "What's one thing we could improve?",
          required: false,
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
          helpText: "We'll only use this to follow up on your feedback",
          showIf: {
            combine: "AND",
            conditions: [
              { field: "can_contact", operator: "eq", value: true },
            ],
          },
        },
      ],
    },
  ],
  submitAction: { type: "callback" },
};
