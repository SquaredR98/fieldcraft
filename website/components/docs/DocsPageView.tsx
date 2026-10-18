import { DocsMainContent } from './DocsMainContent';
import { DocsToc } from './DocsToc';
import { DocsMobileTocDropdown } from './DocsMobileTocDropdown';
import { DocsPagination } from './DocsPagination';
import { mdxComponents } from './mdx-components';
import type { DocNavItem } from './docs-types';

export interface DocsPageViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any;
  breadcrumb: string | null;
  prev: DocNavItem | null;
  next: DocNavItem | null;
  githubPath: string;
}

/**
 * View layer component for documentation pages (Layer 2 in Rule W1).
 * Assembles DocsMainContent, Mobile TOC, MDX Body, Pagination, and Desktop TOC.
 */
export function DocsPageView({
  page,
  breadcrumb,
  prev,
  next,
  githubPath,
}: DocsPageViewProps) {
  const MDX = page.data.body;

  return (
    <>
      <DocsMainContent>
        <article className="fc-docs__article">
          {breadcrumb && (
            <div className="fc-docs__breadcrumb">{breadcrumb}</div>
          )}
          <h1 className="fc-docs__h1">{page.data.title}</h1>
          <DocsMobileTocDropdown toc={page.data.toc} />
          {page.data.description && (
            <p className="fc-docs__description">{page.data.description}</p>
          )}
          <div className="fc-docs__body">
            <MDX components={mdxComponents} />
          </div>
          <DocsPagination prev={prev} next={next} />
          <div className="fc-docs__footer-line">
            <span>MIT licensed &middot; fieldcraft.squaredr.tech</span>
            <a
              href={`https://github.com/SquaredR98/fieldcraft/blob/main/website/content/docs/${githubPath}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Edit this page on GitHub &rarr;
            </a>
          </div>
        </article>
      </DocsMainContent>
      <DocsToc toc={page.data.toc} />
    </>
  );
}
