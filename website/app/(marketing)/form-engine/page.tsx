import type { Metadata } from 'next';
import { getAllTemplates } from '@/lib/templates';
import { FormEngineView } from '@/components/formEngine/FormEngineView';

const URL = 'https://fieldcraft.squaredr.tech/form-engine';

const DESCRIPTION =
  'A form engine turns a schema into a working form — rendering, validation, conditional logic, navigation and submission from one object. How it differs from a form library, and when you need one.';

export const metadata: Metadata = {
  alternates: { canonical: URL },
  title: 'What is a form engine?',
  description: DESCRIPTION,
  openGraph: {
    title: 'What is a form engine? — FieldCraft',
    description: DESCRIPTION,
    url: URL,
    type: 'article',
  },
};

/* Counted from source, per Rule 1. The field count is the post-split
   figure the rest of the site claims — see the spec strip for why. */
const FIELD_COUNT = 18;
const OPERATOR_COUNT = 25;
const VALIDATOR_COUNT = 14;

export default function FormEnginePage() {
  const templateCount = getAllTemplates().length;

  /* FAQPage, not Article: the page answers discrete questions, which
     is the shape that can earn an expanded result for a "what is"
     query. Every answer here is a condensed version of copy actually
     on the page — structured data that does not match the visible
     content is a spam signal, not a shortcut. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a form engine?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A form engine turns a data structure into a working form. You describe the fields, rules and flow once; the engine handles rendering, validation, conditional visibility, navigation and submission. The form becomes data you can version and review rather than components you maintain by hand.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between a form engine and a form library?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A form library manages state, validation and submission for a form you have already built — you write the JSX for every field. A form engine takes a description of the form and renders it, so adding a question is a data change rather than a code change. You own the markup with a library; you own the schema with an engine.',
        },
      },
      {
        '@type': 'Question',
        name: 'When do you need a form engine?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When forms are numerous, change often, must be edited without a deploy, are authored by people who do not write React, or carry conditional logic that becomes unreadable as nested components. A single short form with no conditional logic is more code with an engine than without one.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FormEngineView
        fieldCount={FIELD_COUNT}
        operatorCount={OPERATOR_COUNT}
        validatorCount={VALIDATOR_COUNT}
        templateCount={templateCount}
      />
    </>
  );
}
