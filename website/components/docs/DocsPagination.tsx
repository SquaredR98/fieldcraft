import Link from 'next/link';
import type { DocNavItem } from './docs-types';

interface DocsPaginationProps {
  prev: DocNavItem | null;
  next: DocNavItem | null;
}

export function DocsPagination({ prev, next }: DocsPaginationProps) {
  if (!prev && !next) return null;

  return (
    <div className="fc-docs__prev-next">
      {prev ? (
        <Link href={prev.href} className="fc-docs__prev-next-card">
          <div className="fc-docs__prev-next-label">Previous</div>
          <div className="fc-docs__prev-next-title">
            &larr; {prev.title}
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="fc-docs__prev-next-card fc-docs__prev-next-card--next"
        >
          <div className="fc-docs__prev-next-label">Next</div>
          <div className="fc-docs__prev-next-title">
            {next.title} &rarr;
          </div>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
