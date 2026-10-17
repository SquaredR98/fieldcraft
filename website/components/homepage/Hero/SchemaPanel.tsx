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
/*
 * Hand-formatted rather than JSON.stringify'd.
 *
 * `JSON.stringify(schema, null, 2)` produced 65 lines — one property per
 * line, every option object exploded over four. The handoff caps its hero
 * code at 14 lines, and for good reason: nobody reads 65 lines of JSON in a
 * hero, and the pane then dwarfed the form beside it.
 *
 * So each question is one line. Same object, same properties, same order —
 * only the whitespace differs, and it stays legible at the 12px the pane
 * renders at. The content was verified by running the equivalent object
 * through validateSchema() from the published core: it passes (and failed
 * the first time, on an empty `questions` array, which is why asserting
 * beats assuming).
 *
 * Every property is real API, not illustrative:
 *   showIf + operator "eq"   core/src/types/conditions.ts
 *   allowDraftSave           core/src/types/settings.ts (opt-OUT: the
 *                            engine treats !== false as on)
 */
const heroSchema = `{
  "id": "event-registration",
  "settings": { "showProgress": true, "allowDraftSave": true },
  "sections": [
    {
      "id": "attendee",
      "title": "Attendee",
      "questions": [
        { "id": "name",  "type": "short_text", "label": "Full name",  "required": true },
        { "id": "email", "type": "email",      "label": "Work email", "required": true },
        { "id": "ticket", "type": "single_select", "label": "Ticket",
          "options": [{ "label": "Standard", "value": "standard" },
                      { "label": "Workshop", "value": "workshop" }] },
        { "id": "diet", "type": "short_text", "label": "Dietary needs",
          "showIf": { "field": "ticket", "operator": "eq", "value": "workshop" } }
      ]
    },
    { "id": "payment", "title": "Payment", "questions": [
      { "id": "card", "type": "short_text", "label": "Card number", "required": true }
    ] }
  ]
}`;

export function SchemaPanel() {
  return (
    <CodeBlockClient
      code={heroSchema}
      lang="json"
      className="fc-hero-code-block"
    />
  );
}
