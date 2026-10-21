import type { Metadata } from 'next';
import { getTemplatesByCategory, categoryOrder } from '@/lib/templates';
import { TemplateListView } from '@/components/templates/TemplateListView';

export const metadata: Metadata = {
  alternates: { canonical: 'https://fieldcraft.squaredr.tech/templates' },
  title: 'Form Templates — FieldCraft',
  description:
    'Free, production-ready JSON form schemas. Contact forms, NPS surveys, job applications, patient intake, and more. Copy the schema, drop it into your React app.',
  openGraph: {
    title: 'Free form templates for React — FieldCraft',
    description:
      'Production-ready JSON form schemas. Contact forms, surveys, HR forms, and more. Copy, paste, and ship.',
  },
};

export default function TemplatesPage() {
  const templatesByCategory = getTemplatesByCategory();
  const all = Object.values(templatesByCategory).flat();
  const totalCount = all.length;

  /* ItemList of every template. A gallery of free, named schemas is
     the shape search engines can show as a rich result, and each
     entry links to a page that actually exists. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'FieldCraft form templates',
    description:
      'Free, production-ready JSON form schemas for React — contact forms, surveys, HR and intake forms.',
    numberOfItems: totalCount,
    itemListElement: all.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://fieldcraft.squaredr.tech/templates/${t.meta.id}`,
      name: t.meta.name,
      description: t.meta.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TemplateListView
        templatesByCategory={templatesByCategory}
        categories={categoryOrder}
        totalCount={totalCount}
      />
    </>
  );
}
