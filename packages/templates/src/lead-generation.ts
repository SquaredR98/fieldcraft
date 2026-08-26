import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const leadGenerationSchema: FormEngineSchema = {
  id: "lead-generation",
  version: "1.0.0",
  title: "Get a Free Demo",
  description:
    "Fill out the form below and our team will reach out to schedule a personalized demo.",
  settings: {
    showProgress: true,
    progressStyle: "bar",
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "contact",
      title: "Contact Information",
      description: "How can we reach you?",
      questions: [
        {
          id: "full_name",
          type: "short_text",
          label: "Full Name",
          required: true,
          placeholder: "Jane Doe",
          validation: [
            { type: "minLength", value: 2 },
            { type: "maxLength", value: 100 },
          ],
        },
        {
          id: "work_email",
          type: "email",
          label: "Work Email",
          required: true,
          placeholder: "jane@company.com",
          helpText: "Please use your work email address",
        },
        {
          id: "phone",
          type: "phone",
          label: "Phone Number",
          required: false,
          placeholder: "(555) 123-4567",
        },
        {
          id: "company",
          type: "short_text",
          label: "Company Name",
          required: true,
          placeholder: "Acme Corp",
          validation: [{ type: "maxLength", value: 100 }],
        },
      ],
    },
    {
      id: "qualification",
      title: "About Your Needs",
      description: "Help us prepare the best demo for you",
      questions: [
        {
          id: "company_size",
          type: "single_select",
          label: "Company Size",
          required: true,
          options: [
            { label: "1-10 employees", value: "1-10" },
            { label: "11-50 employees", value: "11-50" },
            { label: "51-200 employees", value: "51-200" },
            { label: "201-1000 employees", value: "201-1000" },
            { label: "1000+ employees", value: "1000+" },
          ],
        },
        {
          id: "industry",
          type: "dropdown",
          label: "Industry",
          required: false,
          options: [
            { label: "Technology", value: "tech" },
            { label: "Healthcare", value: "healthcare" },
            { label: "Finance", value: "finance" },
            { label: "Education", value: "education" },
            { label: "Retail / E-commerce", value: "retail" },
            { label: "Manufacturing", value: "manufacturing" },
            { label: "Government", value: "government" },
            { label: "Non-profit", value: "nonprofit" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "use_case",
          type: "long_text",
          label: "What are you looking to solve?",
          required: false,
          placeholder: "Describe your use case or challenge...",
          validation: [{ type: "maxLength", value: 1000 }],
        },
        {
          id: "timeline",
          type: "single_select",
          label: "When are you looking to get started?",
          required: false,
          options: [
            { label: "Immediately", value: "immediately" },
            { label: "Within 1 month", value: "1-month" },
            { label: "1-3 months", value: "1-3-months" },
            { label: "3-6 months", value: "3-6-months" },
            { label: "Just exploring", value: "exploring" },
          ],
        },
      ],
    },
  ],
};

export const leadGenerationMeta = {
  id: "lead-generation",
  name: "Lead Generation",
  description:
    "A 2-section B2B lead generation form with contact details and qualification questions. Includes company size, industry, use case, and purchase timeline.",
  category: "general" as const,
  fieldCount: 8,
  sectionCount: 2,
  tags: ["lead-gen", "b2b", "sales", "demo-request"],
};

export const leadGeneration: Template = {
  meta: leadGenerationMeta,
  schema: leadGenerationSchema,
};
