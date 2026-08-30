import type { Metadata } from 'next';
import { getTemplatesByCategory, categoryOrder } from '@/lib/templates';
import { TemplateListView } from '@/components/templates/TemplateListView';

export const metadata: Metadata = {
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
  const totalCount = Object.values(templatesByCategory).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <TemplateListView
      templatesByCategory={templatesByCategory}
      categories={categoryOrder}
      totalCount={totalCount}
    />
  );
}
