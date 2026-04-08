import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export const advancedFieldsDemo: FormEngineSchema = {
  id: "advanced-fields-demo",
  version: "1.0.0",
  title: "Advanced Field Types",
  description: "Demonstrates advanced fields: address, payment, matrix, repeater, calculated, hidden, scoring, consent, and info blocks.",
  settings: {
    showProgress: true,
    progressStyle: "bar",
  },
  sections: [
    {
      id: "structured",
      title: "Structured Fields",
      questions: [
        {
          id: "address_example",
          type: "address",
          label: "Mailing Address",
          required: false,
          helpText: "Structured address input (street, city, state, zip, country)",
        },
        {
          id: "payment_example",
          type: "payment",
          label: "Payment Details",
          required: false,
          helpText: "Payment card input (demo only — no real charges)",
        },
        {
          id: "matrix_example",
          type: "matrix",
          label: "Feature Importance Matrix",
          required: false,
          helpText: "Grid/matrix input — rate multiple items on the same scale",
          options: [
            { label: "Speed", value: "speed" },
            { label: "Reliability", value: "reliability" },
            { label: "Ease of Use", value: "ease" },
            { label: "Documentation", value: "docs" },
          ],
        },
      ],
    },
    {
      id: "dynamic",
      title: "Dynamic & Computed Fields",
      questions: [
        {
          id: "repeater_example",
          type: "repeater",
          label: "Work Experience",
          required: false,
          helpText: "Add multiple entries (click + to add more)",
        },
        {
          id: "calculated_example",
          type: "calculated",
          label: "Auto-Calculated Score",
          required: false,
          helpText: "This value is computed from other field values automatically",
        },
        {
          id: "hidden_example",
          type: "hidden",
          label: "Tracking ID",
          required: false,
          helpText: "Hidden field — not visible to the user but included in submission",
        },
        {
          id: "scoring_example",
          type: "scoring",
          label: "Assessment Score",
          required: false,
          helpText: "Scoring field that tallies points from selected answers",
        },
      ],
    },
    {
      id: "structural",
      title: "Structural & Legal",
      questions: [
        {
          id: "info_block_example",
          type: "info_block",
          label: "Important Information",
          required: false,
          helpText: "This is a read-only info block — used for instructions or notices that don't collect data.",
        },
        {
          id: "consent_example",
          type: "consent",
          label: "I agree to the Terms of Service and Privacy Policy",
          required: true,
          helpText: "Consent checkbox — must be checked to proceed",
        },
      ],
    },
  ],
  submitAction: { type: "callback" },
};
