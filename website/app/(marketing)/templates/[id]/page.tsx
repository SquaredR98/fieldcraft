import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTemplateById, getAllTemplateIds, categoryLabels } from '@/lib/templates';
import { TemplateDetailView } from '@/components/templates/TemplateDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllTemplateIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const template = getTemplateById(id);
  if (!template) return { title: 'Template Not Found — FieldCraft' };

  return {
    title: `${template.meta.name} — FieldCraft Templates`,
    description: template.meta.description,
  };
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const template = getTemplateById(id);

  if (!template) {
    notFound();
  }

  return <TemplateDetailView template={template} />;
}
