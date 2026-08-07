'use client';

import { useState } from 'react';
import { CodeBlockClient } from '@/components/shared/CodeBlock/CodeBlockClient';

type Tab = 'event-registration' | 'patient-intake';

const eventRegistrationJson = `{
  "id": "event-registration",
  "settings": {
    "showProgress": true,
    "progressStyle": "steps"
  },
  "sections": [
    {
      "id": "attendee",
      "questions": [
        {
          "id": "ticket",
          "type": "single_select",
          "required": true,
          "options": [ \u2026 ]
        },
        {
          "id": "dinner",
          "type": "boolean"
        },
        {
          "id": "dietary",
          "type": "dropdown",
          "showIf": {
            "field": "dinner",
            "operator": "eq",
            "value": true
          }
        }
      ]
    },
    {
      "id": "workshops",
      "showIf": {
        "field": "ticket",
        "operator": "eq",
        "value": "workshop"
      },
      "questions": [ \u2026 ]
    },
    {
      "id": "summary",
      "questions": [
        {
          "id": "subtotal",
          "type": "calculated",
          "config": {
            "expression": "\u2026",
            "format": "currency"
          }
        },
        {
          "id": "consent",
          "type": "boolean",
          "required": true
        }
      ]
    }
  ]
}`;

const patientIntakeJson = `{
  "id": "patient-intake",
  "settings": {
    "persistDraft": true,
    "showProgress": true
  },
  "sections": [
    {
      "id": "identity",
      "questions": [
        {
          "id": "dob",
          "type": "date",
          "required": true
        },
        {
          "id": "nhs_id",
          "type": "short_text",
          "validation": {
            "pattern": "^\\\\d{10}$"
          }
        }
      ]
    },
    {
      "id": "history",
      "questions": [
        {
          "id": "conditions",
          "type": "multi_select",
          "options": [ \u2026 ]
        },
        {
          "id": "medications",
          "type": "long_text",
          "showIf": {
            "field": "conditions",
            "operator": "not_empty"
          }
        }
      ]
    },
    {
      "id": "scoring",
      "questions": [
        {
          "id": "risk",
          "type": "calculated",
          "config": {
            "expression": "{q1} + {q2} + {q3}"
          }
        }
      ]
    }
  ]
}`;

const descriptions: Record<Tab, string> = {
  'event-registration':
    'Three sections, twelve fields. The ticket answer decides whether the workshop section exists at all, so the progress indicator shows two steps or three. Dietary preferences only appear if the attendee opts into dinner. The summary section calculates a subtotal from earlier answers and formats it as currency.',
  'patient-intake':
    'A clinical intake with pattern-validated identifiers, drafts on by default because these forms are long and patients abandon them. Medical history uses conditional branching \u2014 the medications field only appears when at least one condition is selected. The scoring section computes a risk score from earlier answers.',
};

export function SchemaTabs() {
  const [tab, setTab] = useState<Tab>('event-registration');

  return (
    <div className="fc-schemas__grid">
      <div>
        <div className="fc-schemas__tabs">
          <button
            className={`fc-schemas__tab ${tab === 'event-registration' ? 'fc-schemas__tab--active' : ''}`}
            onClick={() => setTab('event-registration')}
          >
            event-registration
          </button>
          <button
            className={`fc-schemas__tab ${tab === 'patient-intake' ? 'fc-schemas__tab--active' : ''}`}
            onClick={() => setTab('patient-intake')}
          >
            patient-intake
          </button>
        </div>
        <div key={tab} className="fc-tab-panel-enter">
          <CodeBlockClient
            code={tab === 'event-registration' ? eventRegistrationJson : patientIntakeJson}
            lang="json"
          />
        </div>
      </div>

      <div className="fc-schemas__sidebar">
        <div className="fc-schemas__sidebar-top">
          <div className="fc-schemas__sidebar-eyebrow">
            What this schema does
          </div>
          <div className="fc-schemas__sidebar-desc">
            {descriptions[tab]}
          </div>
        </div>
        <div className="fc-schemas__sidebar-bottom">
          <div className="fc-schemas__sidebar-text">
            You can write this JSON by hand &mdash; many people do. Or generate
            it from your admin panel, pull it from an API, or store it in a
            database.{' '}
            <a href="/products/fieldcraft/docs/visual-builder" className="fc-schemas__sidebar-link">
              See the visual builder &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
