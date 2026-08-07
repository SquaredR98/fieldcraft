'use client';

import { CodeBlockClient } from '@/components/shared/CodeBlock/CodeBlockClient';

const heroSchema = JSON.stringify(
  {
    id: "patient-intake",
    settings: { showProgress: true },
    sections: [
      {
        id: "details",
        title: "Patient details",
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
            label: "Email",
            required: true,
          },
          {
            id: "consent",
            type: "boolean",
            label: "Share records with my GP",
          },
          {
            id: "gp",
            type: "short_text",
            label: "GP practice",
            showIf: {
              field: "consent",
              operator: "eq",
              value: true,
            },
          },
        ],
      },
    ],
  },
  null,
  2,
);

export function SchemaPanel() {
  return <CodeBlockClient code={heroSchema} lang="json" className="fc-hero-code-block" />;
}
