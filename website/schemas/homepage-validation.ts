import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export const homepageValidationSchema: FormEngineSchema = {
  id: "homepage-validation",
  version: "1.0.0",
  title: "Account Verification",
  description: "Real-time validation on every keystroke.",
  settings: {
    showProgress: false,
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "verify",
      title: "Verify",
      questions: [
        {
          id: "email",
          type: "email",
          label: "Email address",
          required: true,
          helpText: "Must be a valid email format",
        },
        {
          id: "license_key",
          type: "short_text",
          label: "License key",
          required: true,
          helpText: "Format: FC-0000-0000",
          validation: [
            {
              type: "pattern",
              regex: "^FC-\\d{4}-\\d{4}$",
              message: "Must match pattern FC-0000-0000",
            },
          ],
        },
      ],
    },
  ],
};
