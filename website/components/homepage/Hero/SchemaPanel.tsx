'use client';

import { CodeBlockClient } from '@/components/shared/CodeBlock/CodeBlockClient';

/*
 * The left half of the hero panel, and it must stay in lockstep with
 * HeroForm: the whole point of showing them together is that the
 * reader can trace a line from a schema property to the thing it produced.
 * A field here with no counterpart on the right makes the panel a lie.
 *
 * Every property below is real API, not illustrative:
 *   `showIf` with operator "eq"   core/src/types/conditions.ts
 *   `allowDraftSave`              core/src/types/settings.ts (opt-OUT —
 *                                 the engine treats !== false as on)
 *   `validation: [{ type }]`      one of the 14 runtime rule types in
 *                                 core/src/schema/schema-validator.ts
 * A schema shown on a page that invites readers to count from source has
 * to actually validate.
 */
const heroSchema = JSON.stringify(
  {
    id: 'event-registration',
    settings: { showProgress: true, allowDraftSave: true },
    sections: [
      {
        id: 'attendee',
        title: 'Attendee',
        description: "Tell us who's coming.",
        questions: [
          { id: 'name', type: 'short_text', label: 'Full name', required: true },
          { id: 'email', type: 'email', label: 'Work email', required: true },
          {
            id: 'ticket',
            type: 'single_select',
            label: 'Ticket',
            options: [
              { label: 'Standard', value: 'standard' },
              { label: 'Workshop', value: 'workshop' },
            ],
          },
          {
            id: 'diet',
            type: 'short_text',
            label: 'Dietary needs',
            showIf: { field: 'ticket', operator: 'eq', value: 'workshop' },
          },
        ],
      },
      {
        id: 'payment',
        title: 'Payment',
        // Section 2 exists so "Step 1 of 2" on the right is backed by a real
        // second section. It needs a question of its own: validateSchema()
        // rejects an empty section ("Section must have at least one
        // question"), and a schema shown on this page has to actually run.
        questions: [
          { id: 'card', type: 'short_text', label: 'Card number', required: true },
        ],
      },
    ],
  },
  null,
  2,
);

export function SchemaPanel() {
  return (
    <CodeBlockClient
      code={heroSchema}
      lang="json"
      className="fc-hero-code-block"
    />
  );
}
