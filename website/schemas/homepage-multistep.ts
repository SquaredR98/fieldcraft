import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export const homepageMultistepSchema: FormEngineSchema = {
  id: "homepage-multistep",
  version: "1.0.0",
  title: "Team Registration",
  description: "A three-step form with progress tracking and navigation.",
  settings: {
    showProgress: true,
    progressStyle: "steps",
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "contact",
      title: "Contact",
      questions: [
        {
          id: "name",
          type: "short_text",
          label: "Full name",
          required: true,
        },
        {
          id: "email",
          type: "email",
          label: "Work email",
          required: true,
        },
      ],
    },
    {
      id: "team",
      title: "Team",
      questions: [
        {
          id: "team_size",
          type: "number",
          label: "Team size",
          required: true,
          validation: [
            { type: "min", value: 1 },
            { type: "max", value: 200 },
          ],
        },
        {
          id: "project",
          type: "dropdown",
          label: "Primary use case",
          required: true,
          options: [
            { label: "Patient intake", value: "intake" },
            { label: "Event registration", value: "events" },
            { label: "Surveys", value: "surveys" },
            { label: "Internal workflows", value: "internal" },
          ],
        },
      ],
    },
    {
      id: "confirm",
      title: "Confirm",
      questions: [
        {
          id: "notes",
          type: "long_text",
          label: "Anything else we should know?",
          required: false,
        },
        {
          id: "consent",
          type: "consent",
          label: "I agree to the terms of service",
          required: true,
        },
      ],
    },
  ],
};
