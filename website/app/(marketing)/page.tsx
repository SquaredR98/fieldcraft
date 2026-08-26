import { HomepageView } from '@/components/homepage/HomepageView';
import { getTemplateById } from '@/lib/templates';
import { getNpmStats } from '@/lib/npm-stats';

const showcaseIds = ['contact-form', 'feedback-survey', 'job-application'];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FieldCraft',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description:
    'A self-hosted, schema-driven form engine for React. 42 field types, validation, conditional logic, multi-step navigation, and draft persistence.',
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
