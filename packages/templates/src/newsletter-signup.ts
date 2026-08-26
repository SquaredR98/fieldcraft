import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const newsletterSignupSchema: FormEngineSchema = {
  id: "newsletter-signup",
  version: "1.0.0",
  title: "Newsletter Signup",
  description: "Subscribe to our newsletter and stay in the loop.",
  settings: {
    showProgress: false,
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "subscribe",
      title: "Stay Updated",
      description: "Get the latest news, tips, and product updates delivered to your inbox",
      questions: [
        {
          id: "email",
          type: "email",
          label: "Email Address",
          required: true,
          placeholder: "you@company.com",
        },
        {
          id: "first_name",
          type: "short_text",
          label: "First Name",
          required: false,
          placeholder: "Jane",
          validation: [{ type: "maxLength", value: 50 }],
        },
        {
          id: "interests",
          type: "multi_select",
          label: "What topics interest you?",
          required: false,
          helpText: "Select all that apply — helps us send relevant content",
          options: [
            { label: "Product Updates", value: "product" },
            { label: "Engineering Blog", value: "engineering" },
            { label: "Tutorials & Guides", value: "tutorials" },
            { label: "Industry News", value: "industry" },
            { label: "Case Studies", value: "case-studies" },
          ],
        },
      ],
    },
  ],
};

export const newsletterSignupMeta = {
  id: "newsletter-signup",
  name: "Newsletter Signup",
  description:
    "A minimal newsletter subscription form with email, optional name, and topic interest selection. Single section, no progress bar — designed for embedding.",
  category: "marketing" as const,
  fieldCount: 3,
  sectionCount: 1,
  tags: ["newsletter", "signup", "marketing", "email"],
};

export const newsletterSignup: Template = {
  meta: newsletterSignupMeta,
  schema: newsletterSignupSchema,
};
