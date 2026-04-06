import type { FormEngineSchema } from "@squaredr/formengine-core";

export const contactFormSchema: FormEngineSchema = {
  id: "contact-form",
  version: "1.0.0",
  title: "Contact Us",
  description: "Get in touch with our team. We'll get back to you within 24 hours.",
  settings: {
    showProgress: true,
    progressStyle: "percentage",
  },
  sections: [
    {
      id: "personal-info",
      title: "Personal Information",
      description: "Tell us about yourself",
      questions: [
        {
          id: "name",
          type: "short_text",
          label: "Full Name",
          required: true,
          validation: [
            { type: "minLength", value: 2 },
            { type: "maxLength", value: 50 },
          ],
          helpText: "Your full legal name",
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          required: true,
          helpText: "We'll never share your email",
        },
        {
          id: "phone",
          type: "phone",
          label: "Phone Number",
          required: false,
          helpText: "Optional - we'll only call if necessary",
        },
      ],
    },
    {
      id: "inquiry",
      title: "Your Inquiry",
      description: "How can we help you?",
      questions: [
        {
          id: "subject",
          type: "dropdown",
          label: "Subject",
          required: true,
          options: [
            { label: "General Inquiry", value: "general" },
            { label: "Technical Support", value: "support" },
            { label: "Sales", value: "sales" },
            { label: "Feedback", value: "feedback" },
            { label: "Partnership", value: "partnership" },
          ],
        },
        {
          id: "message",
          type: "long_text",
          label: "Message",
          required: true,
          validation: [
            { type: "minLength", value: 10 },
            { type: "maxLength", value: 1000 },
          ],
          helpText: "Please provide details about your inquiry (10-1000 characters)",
        },
        {
          id: "newsletter",
          type: "boolean",
          label: "Subscribe to our newsletter",
          required: false,
          helpText: "Stay updated with our latest news and offers",
        },
      ],
    },
  ],
  submitAction: {
    type: "http",
    url: "http://localhost:4000/api/v1/responses",
    method: "POST",
  },
};
