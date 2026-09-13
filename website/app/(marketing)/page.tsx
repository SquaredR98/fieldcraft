import type { Metadata } from 'next';
import { HomepageView } from '@/components/homepage/HomepageView';
import { getAllTemplates, getTemplateById } from '@/lib/templates';
import { changelog } from '@/lib/changelog';

export const metadata: Metadata = {
  title: 'FieldCraft — Self-hosted form engine for React',
  description:
    'Responses go straight from the browser to infrastructure you control — no vendor in the path. Schema-driven form engine for React with 41 field types, conditional logic, multi-step forms and validation. MIT licensed.',
  openGraph: {
    title: 'FieldCraft — Self-hosted form engine for React',
    description:
      'Your forms, your database, nobody in the middle. 41 field types, conditional logic, multi-step navigation and validation, defined once in JSON. MIT licensed.',
  },
};

const showcaseIds = ['contact-form', 'feedback-survey', 'job-application'];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FieldCraft',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description:
    'A self-hosted, schema-driven form engine for React. 41 field types, validation, conditional logic, multi-step navigation, and draft persistence.',
  url: 'https://fieldcraft.squaredr.tech',
  author: {
    '@type': 'Organization',
    name: 'SquaredR',
    url: 'https://squaredr.tech',
  },
  license: 'https://opensource.org/licenses/MIT',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  programmingLanguage: ['TypeScript', 'React'],
};

export default async function HomePage() {
  const showcaseTemplates = showcaseIds
    .map((id) => getTemplateById(id))
    .filter((t) => t !== undefined);

  // Counted, not hardcoded — the showcase footer states how many exist
  // beyond the three shown. See Rule 1 in CLAUDE.md.
  const templateCount = getAllTemplates().length;

  // Latest shipped release, newest first — drives the Status section.
  const latest = [...changelog].sort((a, b) =>
    b.date.localeCompare(a.date)
  )[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomepageView
        showcaseTemplates={showcaseTemplates}
        templateCount={templateCount}
        latestVersion={latest.version}
        latestDate={latest.date}
        latestPackage={latest.packageLabel}
      />
    </>
  );
}
