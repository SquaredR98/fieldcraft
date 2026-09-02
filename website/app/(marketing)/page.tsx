import type { Metadata } from 'next';
import { HomepageView } from '@/components/homepage/HomepageView';
import { getTemplateById } from '@/lib/templates';
import { changelog } from '@/lib/changelog';

export const metadata: Metadata = {
  title: 'FieldCraft — Open-source form engine for React',
  description:
    'Self-hosted, schema-driven form engine for React. 41 field types, conditional logic, multi-step forms, validation, and draft persistence. Define once in JSON, render anywhere. MIT licensed.',
  openGraph: {
    title: 'FieldCraft — Open-source form engine for React',
    description:
      'Self-hosted form engine with 41 field types, conditional logic, multi-step navigation, and validation. Define forms in JSON, own your data. MIT licensed.',
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
        latestVersion={latest.version}
        latestDate={latest.date}
        latestPackage={latest.packageLabel}
      />
    </>
  );
}
