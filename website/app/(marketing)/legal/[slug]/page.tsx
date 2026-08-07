import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLegalPageBySlug, getAllLegalSlugs } from '@/lib/legal';
import { LegalPageView } from '@/components/legal/LegalPageView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllLegalSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPageBySlug(slug);
  if (!page) return { title: 'Not Found — FieldCraft' };

  return {
    title: `${page.title} — FieldCraft`,
  };
}

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getLegalPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <LegalPageView page={page} />;
}
