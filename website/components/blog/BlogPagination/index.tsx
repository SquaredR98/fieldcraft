'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import './styles.css';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
}

/*
 * The foot of the window, mirroring the FilterRail chrome at its head.
 *
 * Client-side for the same reason FilterRail is: it has to preserve the
 * ?category= param while changing ?page=, which means reading the
 * current search params rather than assuming them.
 */
export function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    /* Page 1 drops the param entirely — /blog is the canonical first
       page, and /blog?page=1 would be a duplicate URL for it. */
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const query = params.toString();
    /* Scrolls, unlike the filter rail. The control is at the FOOT of
       the list, so staying put would leave you at the bottom of a
       page you have not seen the top of. */
    router.push(query ? `/blog?${query}` : '/blog');
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav className="fc-blog-pagination" aria-label="Blog pages">
      <button
        className="fc-blog-pagination__step"
        onClick={() => goTo(currentPage - 1)}
        disabled={prevDisabled}
        aria-label="Previous page"
      >
        &larr; Prev
      </button>

      <div className="fc-blog-pagination__pages">
        {pages.map((page) => (
          <button
            key={page}
            className={`fc-blog-pagination__page${
              page === currentPage ? ' fc-blog-pagination__page--active' : ''
            }`}
            onClick={() => goTo(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="fc-blog-pagination__step"
        onClick={() => goTo(currentPage + 1)}
        disabled={nextDisabled}
        aria-label="Next page"
      >
        Next &rarr;
      </button>
    </nav>
  );
}
