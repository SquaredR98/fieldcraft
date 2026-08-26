import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const contactFormSchema: FormEngineSchema = {
  id: "contact-form",
  version: "1.0.0",
  title: "Contact Us",
  description:
    "Get in touch with our team. We'll respond within one business day.",
  settings: {
    showProgress: true,
    progressStyle: "steps",
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "personal-info",
      title: "Your Details",
      description: "Tell us who you are",
      questions: [
        {
          id: "name",
          type: "short_text",
          label: "Full Name",
          required: true,
          placeholder: "Jane Doe",
          validation: [
            { type: "minLength", value: 2, message: "Name is too short" },
            { type: "maxLength", value: 100 },
          ],
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          required: true,
          placeholder: "you@company.com",
          helpText: "We'll never share your email with third parties",
        },
        {
          id: "phone",
          type: "phone",
          label: "Phone Number",
          required: false,
          placeholder: "(555) 123-4567",
          helpText: "Optional — only used if we need to reach you urgently",
        },
      ],
    },
    {
      id: "inquiry",
      title: "Your Message",
      description: "How can we help?",
      questions: [
        {
          id: "subject",
          type: "dropdown",
          label: "Subject",
          required: true,
          options: [
            { label: "General Inquiry", value: "general" },
            { label: "Technical Support", value: "support" },
            { label: "Sales & Pricing", value: "sales" },
            { label: "Partnership", value: "partnership" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "message",
          type: "long_text",
          label: "Message",
          required: true,
          placeholder: "Describe your inquiry in detail...",
          validation: [
            {
              type: "minLength",
              value: 20,
              message: "Please provide at least 20 characters",
            },
            { type: "maxLength", value: 2000 },
          ],
        },
      ],
    },
  ],
};

export const contactFormMeta = {
  id: "contact-form",
  name: "Contact Form",
  description:
    "A two-step contact form with personal details and inquiry fields. Includes name, email, phone, subject dropdown, and message.",
  category: "general" as const,
  fieldCount: 5,
  sectionCount: 2,
  tags: ["contact", "support", "general"],
};

export const contactForm: Template = {
  meta: contactFormMeta,
  schema: contactFormSchema,
};
