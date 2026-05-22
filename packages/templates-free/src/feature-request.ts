import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const featureRequestSchema: FormEngineSchema = {
  id: "feature-request",
  version: "1.0.0",
  title: "Feature Request",
  description:
    "Have an idea for a new feature? We'd love to hear it. Submit your request and we'll review it with the product team.",
  settings: {
    showProgress: true,
    progressStyle: "steps",
    navigation: {
      showBack: true,
    },
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "requester",
      title: "Your Details",
      questions: [
        {
          id: "name",
          type: "short_text",
          label: "Name",
          required: true,
          placeholder: "Jane Doe",
          validation: [{ type: "maxLength", value: 100 }],
        },
        {
          id: "email",
          type: "email",
          label: "Email",
          required: true,
          placeholder: "you@company.com",
        },
        {
          id: "role",
          type: "dropdown",
          label: "Your Role",
          required: false,
          options: [
            { label: "Developer", value: "developer" },
            { label: "Designer", value: "designer" },
            { label: "Product Manager", value: "pm" },
            { label: "Team Lead / Manager", value: "lead" },
            { label: "Executive", value: "executive" },
            { label: "Other", value: "other" },
          ],
        },
      ],
    },
    {
      id: "feature-details",
      title: "Feature Details",
      description: "Describe the feature you'd like to see",
      questions: [
        {
          id: "title",
          type: "short_text",
          label: "Feature Title",
          required: true,
          placeholder: "A short, descriptive title",
          validation: [
            { type: "minLength", value: 5, message: "Please be more specific" },
            { type: "maxLength", value: 150 },
          ],
        },
        {
          id: "description",
          type: "long_text",
          label: "Describe the Feature",
          required: true,
          placeholder: "What should this feature do? How would it work?",
          helpText: "The more detail you provide, the better we can evaluate it",
          validation: [
            { type: "minLength", value: 30, message: "Please provide more detail" },
            { type: "maxLength", value: 3000 },
          ],
        },
        {
          id: "problem",
          type: "long_text",
          label: "What problem does this solve?",
          required: true,
          placeholder: "Describe the pain point or workflow this would improve...",
          validation: [
            { type: "minLength", value: 20 },
            { type: "maxLength", value: 1500 },
          ],
        },
        {
          id: "priority",
          type: "single_select",
          label: "How important is this to you?",
          required: true,
          options: [
            { label: "Critical — blocking my work", value: "critical" },
            { label: "High — significant productivity impact", value: "high" },
            { label: "Medium — nice to have", value: "medium" },
            { label: "Low — minor improvement", value: "low" },
          ],
        },
        {
          id: "workaround",
          type: "long_text",
          label: "Current Workaround",
          required: false,
          placeholder: "How are you solving this today without the feature?",
          helpText: "Optional — helps us understand urgency",
          validation: [{ type: "maxLength", value: 1000 }],
        },
        {
          id: "examples",
          type: "url",
          label: "Reference / Example URL",
          required: false,
          placeholder: "https://...",
          helpText: "Link to a similar feature in another product, mockup, or spec",
        },
        {
          id: "notify",
          type: "boolean",
          label: "Notify me when this feature ships",
          required: false,
        },
      ],
    },
  ],
};

export const featureRequestMeta = {
  id: "feature-request",
  name: "Feature Request",
  description:
    "A structured feature request form with requester details, feature description, problem statement, priority classification, workaround, and reference links. Two sections with step navigation.",
  category: "general" as const,
  fieldCount: 10,
  sectionCount: 2,
  tags: ["feature-request", "product", "feedback", "roadmap"],
};

export const featureRequest: Template = {
  meta: featureRequestMeta,
  schema: featureRequestSchema,
};
