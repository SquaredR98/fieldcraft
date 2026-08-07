import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export const multiSectionDemo: FormEngineSchema = {
  id: "multi-section-demo",
  version: "1.0.0",
  title: "Multi-Section Wizard",
  description: "A 4-step wizard form with progress tracking. Each section is a separate step with its own validation.",
  settings: {
    showProgress: true,
    progressStyle: "bar",
    allowDraftSave: true,
    draftTtlHours: 72,
  },
  sections: [
    {
      id: "step-1-personal",
      title: "Step 1: Personal Info",
      description: "Basic personal details",
      questions: [
        {
          id: "full_name",
          type: "short_text",
          label: "Full Name",
          required: true,
          validation: [{ type: "minLength", value: 2 }],
        },
        {
          id: "dob",
          type: "date",
          label: "Date of Birth",
          required: true,
        },
        {
          id: "gender",
          type: "single_select",
          label: "Gender",
          required: false,
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Non-binary", value: "non_binary" },
            { label: "Prefer not to say", value: "undisclosed" },
          ],
        },
      ],
    },
    {
      id: "step-2-contact",
      title: "Step 2: Contact Details",
      description: "How can we reach you?",
      questions: [
        {
          id: "contact_email",
          type: "email",
          label: "Email Address",
          required: true,
        },
        {
          id: "contact_phone",
          type: "phone",
          label: "Phone Number",
          required: false,
        },
        {
          id: "contact_address",
          type: "address",
          label: "Home Address",
          required: false,
        },
      ],
    },
    {
      id: "step-3-preferences",
      title: "Step 3: Preferences",
      description: "Tell us what you like",
      questions: [
        {
          id: "newsletter",
          type: "boolean",
          label: "Subscribe to newsletter?",
          required: false,
        },
        {
          id: "contact_method",
          type: "single_select",
          label: "Preferred Contact Method",
          required: true,
          options: [
            { label: "Email", value: "email" },
            { label: "Phone", value: "phone" },
            { label: "SMS", value: "sms" },
          ],
        },
        {
          id: "interests",
          type: "multi_select",
          label: "Areas of Interest",
          required: false,
          options: [
            { label: "Technology", value: "tech" },
            { label: "Design", value: "design" },
            { label: "Business", value: "business" },
            { label: "Science", value: "science" },
            { label: "Arts", value: "arts" },
          ],
        },
      ],
    },
    {
      id: "step-4-confirm",
      title: "Step 4: Confirmation",
      description: "Review and confirm your submission",
      questions: [
        {
          id: "feedback",
          type: "long_text",
          label: "Any additional comments?",
          required: false,
          helpText: "Optional — tell us anything else you'd like us to know",
          validation: [{ type: "maxLength", value: 500 }],
        },
        {
          id: "satisfaction",
          type: "rating",
          label: "How was this form experience?",
          required: false,
          helpText: "Rate how easy this form was to fill out",
        },
        {
          id: "terms_consent",
          type: "consent",
          label: "I agree to the Terms of Service and Privacy Policy",
          required: true,
        },
      ],
    },
  ],
  submitAction: { type: "callback" },
};
