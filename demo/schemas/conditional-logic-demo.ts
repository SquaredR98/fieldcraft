import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export const conditionalLogicDemo: FormEngineSchema = {
  id: "conditional-logic-demo",
  version: "1.0.0",
  title: "Conditional Logic Demo",
  description: "Shows how fields appear/hide based on previous answers. Try selecting different options to see fields change dynamically.",
  settings: {
    showProgress: true,
    progressStyle: "percentage",
  },
  sections: [
    {
      id: "basic-conditional",
      title: "Basic Conditional Visibility",
      description: "Fields below will show/hide based on your answers",
      questions: [
        {
          id: "has_account",
          type: "boolean",
          label: "Do you already have an account?",
          required: true,
        },
        {
          id: "account_email",
          type: "email",
          label: "What email is your account under?",
          required: true,
          helpText: "This field only appears if you said Yes above",
          showIf: {
            combine: "AND",
            conditions: [
              { field: "has_account", operator: "eq", value: true },
            ],
          },
        },
        {
          id: "signup_reason",
          type: "single_select",
          label: "Why do you want to create an account?",
          required: true,
          helpText: "This field only appears if you said No above",
          options: [
            { label: "Personal use", value: "personal" },
            { label: "Business use", value: "business" },
            { label: "Just exploring", value: "exploring" },
          ],
          showIf: {
            combine: "AND",
            conditions: [
              { field: "has_account", operator: "eq", value: false },
            ],
          },
        },
        {
          id: "company_name",
          type: "short_text",
          label: "Company Name",
          required: true,
          helpText: "This only appears if you selected 'Business use' above — nested conditional!",
          showIf: {
            combine: "AND",
            conditions: [
              { field: "signup_reason", operator: "eq", value: "business" },
            ],
          },
        },
      ],
    },
    {
      id: "advanced-conditional",
      title: "Multi-Condition Logic",
      description: "Fields that depend on multiple previous answers",
      questions: [
        {
          id: "age_group",
          type: "dropdown",
          label: "Age Group",
          required: true,
          options: [
            { label: "Under 18", value: "under_18" },
            { label: "18-25", value: "18_25" },
            { label: "26-40", value: "26_40" },
            { label: "41-60", value: "41_60" },
            { label: "60+", value: "60_plus" },
          ],
        },
        {
          id: "interest",
          type: "single_select",
          label: "Primary Interest",
          required: true,
          options: [
            { label: "Gaming", value: "gaming" },
            { label: "Productivity", value: "productivity" },
            { label: "Health & Fitness", value: "health" },
            { label: "Education", value: "education" },
          ],
        },
        {
          id: "student_discount",
          type: "boolean",
          label: "Would you like information about our student discount?",
          required: false,
          helpText: "Appears only for 18-25 age group interested in Education",
          showIf: {
            combine: "AND",
            conditions: [
              { field: "age_group", operator: "eq", value: "18_25" },
              { field: "interest", operator: "eq", value: "education" },
            ],
          },
        },
        {
          id: "parental_consent",
          type: "consent",
          label: "I confirm my parent/guardian has approved this submission",
          required: true,
          helpText: "Required for users under 18",
          showIf: {
            combine: "AND",
            conditions: [
              { field: "age_group", operator: "eq", value: "under_18" },
            ],
          },
        },
      ],
    },
  ],
  submitAction: { type: "callback" },
};
