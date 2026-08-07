import type { Metadata } from 'next';
import { getTemplatesByCategory, categoryOrder } from '@/lib/templates';
import { TemplateListView } from '@/components/templates/TemplateListView';

export const metadata: Metadata = {
  title: 'Templates — FieldCraft',
  description:
    'Free, production-ready form schemas for FieldCraft. Contact forms, surveys, HR forms, and more.',
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
