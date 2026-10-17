import { CodeBlock } from '@/components/shared/CodeBlock';

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
/*
 * Formatted normally: one key per line, two-space indent.
 *
 * An earlier pass hand-compacted this to fight the pane's HEIGHT — the
 * schema is only shown beside a form and 64 lines made the panel very
 * tall. That traded a vertical problem for a worse horizontal one: lines
 * reached 89 characters in a column about 540px wide, so the pane
 * scrolled sideways and the JSON ran off the edge.
 *
 * Vertical scroll in a code pane is ordinary; horizontal scroll is a
 * defect. The pane caps its height and scrolls, which is the right place
 * for the constraint to live.
 *
 * Every property is real API, not illustrative:
 *   `showIf` with operator "eq"   core/src/types/conditions.ts
 *   `allowDraftSave`              core/src/types/settings.ts (opt-OUT —
 *                                 the engine treats !== false as on)
 * The equivalent object was run through validateSchema() from the
 * published core and passes — it failed the first time, on an empty
 * `questions` array, which is why asserting beats assuming.
 */
const heroSchema = `{
  "id": "event-registration",
  "settings": {
    "showProgress": true,
    "allowDraftSave": true
  },
  "sections": [
    {
      "id": "attendee",
      "title": "Attendee",
      "questions": [
        {
          "id": "name",
          "type": "short_text",
          "label": "Full name",
          "required": true
        },
        {
          "id": "email",
          "type": "email",
          "label": "Work email",
          "required": true
        },
        {
          "id": "ticket",
          "type": "single_select",
          "label": "Ticket",
          "options": [
            {
              "label": "Standard",
              "value": "standard"
            },
            {
              "label": "Workshop",
              "value": "workshop"
            }
          ]
        },
        {
          "id": "diet",
          "type": "short_text",
          "label": "Dietary needs",
          "showIf": {
            "field": "ticket",
            "operator": "eq",
            "value": "workshop"
          }
        }
      ]
    },
    {
      "id": "payment",
      "title": "Payment",
      "questions": [
        {
          "id": "card",
          "type": "short_text",
          "label": "Card number",
          "required": true
        }
      ]
    }
  ]
}`;

/*
 * A SERVER component, using the server CodeBlock.
 *
 * It was 'use client' with CodeBlockClient, which lazy-imports Shiki in a
 * useEffect: the browser downloaded a syntax highlighter, initialised it
 * with two themes and four languages, and swapped the markup in after
 * hydration — to colour a schema that is a constant in this file and
 * never changes. The server CodeBlock highlights it at build time for no
 * runtime cost, and the unhighlighted flash before hydration goes away.
 *
 * Works because HeroPanel takes this as `children` rather than importing
 * it; a client component importing a server one would pull it, and
 * Shiki, back into the bundle.
 */
export async function SchemaPanel() {
  return (
    <CodeBlock code={heroSchema} lang="json" className="fc-hero-code-block" />
  );
}
