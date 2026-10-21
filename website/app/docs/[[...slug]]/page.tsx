import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { DocsPageView } from '@/components/docs/DocsPageView';
import { docsNav, getDocPagination } from '@/components/docs/docs-nav';

function getBreadcrumb(pathname: string) {
  const section = docsNav.find((s) =>
    s.items.some((item) => item.href === pathname)
  );
  const page = section?.items.find((item) => item.href === pathname);
  if (!section || !page) return null;
  return `${section.label} / ${page.title}`;
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const pathname = page.url;
  const breadcrumb = getBreadcrumb(pathname);
  const { prev, next } = getDocPagination(pathname);
  const githubPath =
    params.slug && params.slug.length > 0
      ? `${params.slug.join('/')}.md`
      : 'index.md';

  return (
    <DocsPageView
      page={page}
      breadcrumb={breadcrumb}
      prev={prev}
      next={next}
      githubPath={githubPath}
    />
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const path = params.slug?.length ? `/${params.slug.join('/')}` : '';

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: `https://fieldcraft.squaredr.tech/docs${path}`,
    },
    openGraph: {
      title: `${page.data.title} — FieldCraft docs`,
      description: page.data.description,
      type: 'article',
    },
  };
}
