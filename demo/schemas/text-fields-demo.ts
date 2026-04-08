import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export const textFieldsDemo: FormEngineSchema = {
  id: "text-fields-demo",
  version: "1.0.0",
  title: "Text Field Types",
  description: "Demonstrates all text-based field types: short text, long text, email, phone, URL, and legal name.",
  settings: {
    showProgress: true,
    progressStyle: "bar",
  },
  sections: [
    {
      id: "basic-text",
      title: "Basic Text Inputs",
      questions: [
        {
          id: "short_text_example",
          type: "short_text",
          label: "Short Text",
          required: true,
          helpText: "A single-line text input with min/max length validation",
          validation: [
            { type: "minLength", value: 2 },
            { type: "maxLength", value: 100 },
          ],
        },
        {
          id: "long_text_example",
          type: "long_text",
          label: "Long Text",
          required: true,
          helpText: "A multi-line textarea for longer responses",
          validation: [
            { type: "minLength", value: 10 },
            { type: "maxLength", value: 500 },
          ],
        },
        {
          id: "legal_name_example",
          type: "legal_name",
          label: "Legal Name",
          required: false,
          helpText: "Structured name input (first, middle, last)",
        },
      ],
    },
    {
      id: "contact-text",
      title: "Contact & URL Inputs",
      questions: [
        {
          id: "email_example",
          type: "email",
          label: "Email Address",
          required: true,
          helpText: "Validates email format automatically",
        },
        {
          id: "phone_example",
          type: "phone",
          label: "Phone Number",
          required: false,
          helpText: "Standard phone number input",
        },
        {
          id: "phone_intl_example",
          type: "phone_international",
          label: "International Phone",
          required: false,
          helpText: "Phone input with country code selector",
        },
        {
          id: "url_example",
          type: "url",
          label: "Website URL",
          required: false,
          helpText: "Validates URL format (https://example.com)",
        },
      ],
    },
  ],
  submitAction: { type: "callback" },
};
