import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { DocsToc } from '@/components/docs/DocsToc';
import { DocsPagination } from '@/components/docs/DocsPagination';
import { docsNav, getDocPagination } from '@/components/docs/docs-nav';
import { mdxComponents } from '@/components/docs/mdx-components';

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

  const MDX = page.data.body;
  const pathname = page.url;
  const breadcrumb = getBreadcrumb(pathname);
  const { prev, next } = getDocPagination(pathname);

  return (
    <>
      <article className="fc-docs__article">
        {breadcrumb && (
          <div className="fc-docs__breadcrumb">{breadcrumb}</div>
        )}
        <h1 className="fc-docs__h1">{page.data.title}</h1>
        {page.data.description && (
          <p className="fc-docs__description">{page.data.description}</p>
        )}
        <div className="fc-docs__body">
          <MDX components={mdxComponents} />
        </div>
        <DocsPagination prev={prev} next={next} />
        <div className="fc-docs__footer-line">
          <span>MIT licensed &middot; fieldcraft.squaredr.tech</span>
          <a href="#">Edit this page on GitHub &rarr;</a>
        </div>
      </article>
      <DocsToc toc={page.data.toc} />
    </>
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

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
