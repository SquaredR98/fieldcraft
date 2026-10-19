'use client';

import { useActiveHeading, scrollToHeading, type Heading } from './useActiveHeading';
import './styles.css';

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const activeId = useActiveHeading(headings);

  if (headings.length === 0) return null;

  return (
    <nav className="fc-blog-toc" aria-label="Table of contents">
      <div className="fc-blog-toc__heading">Contents</div>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`fc-blog-toc__link${activeId === h.id ? ' fc-blog-toc__link--active' : ''}`}
          aria-current={activeId === h.id ? 'location' : undefined}
          onClick={(e) => {
            e.preventDefault();
            /* Not scrollIntoView: that aligns to y=0, which is behind
               the floating header. */
            scrollToHeading(h.id);
          }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
