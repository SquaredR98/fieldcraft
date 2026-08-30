import type { Metadata } from 'next';
import { HomepageView } from '@/components/homepage/HomepageView';
import { getTemplateById } from '@/lib/templates';
import { getNpmStats } from '@/lib/npm-stats';

export const metadata: Metadata = {
  title: 'FieldCraft — Open-source form engine for React',
  description:
    'Self-hosted, schema-driven form engine for React. 44 field types, conditional logic, multi-step forms, validation, and draft persistence. Define once in JSON, render anywhere. MIT licensed.',
  openGraph: {
    title: 'FieldCraft — Open-source form engine for React',
    description:
      'Self-hosted form engine with 44 field types, conditional logic, multi-step navigation, and validation. Define forms in JSON, own your data. MIT licensed.',
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
    'A self-hosted, schema-driven form engine for React. 44 field types, validation, conditional logic, multi-step navigation, and draft persistence.',
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

  const npmStats = await getNpmStats();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomepageView showcaseTemplates={showcaseTemplates} npmStats={npmStats} />
    </>
  );
}
