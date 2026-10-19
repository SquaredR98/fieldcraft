'use client';

import { useState } from 'react';
import {
  useActiveHeading,
  scrollToHeading,
  type Heading,
} from '../TableOfContents/useActiveHeading';
import './styles.css';

interface MobileTocProps {
  headings: Heading[];
}

/*
 * The table of contents on narrow screens, as a collapsed disclosure.
 *
 * Replaces a full-height block that used `-order-1` to sit ABOVE the
 * article — so a post with eight headings pushed its own title below
 * the fold on a phone. Collapsed it costs one row, and that row names
 * the heading you are currently in, so it doubles as a position
 * indicator rather than only a control.
 *
 * Desktop hides it entirely; the sticky sidebar does the job there.
 */
export function MobileToc({ headings }: MobileTocProps) {
  const [open, setOpen] = useState(false);
  const activeId = useActiveHeading(headings);

  if (headings.length === 0) return null;

  const active = headings.find((h) => h.id === activeId);

  return (
    <div className="fc-blog-mtoc" data-open={open}>
      <button
        className="fc-blog-mtoc__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="fc-blog-mtoc-panel"
      >
        <span className="fc-blog-mtoc__label">
          {active ? active.text : 'On this page'}
        </span>
        <svg
          className="fc-blog-mtoc__chevron"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6.5 8 10.5 12 6.5" />
        </svg>
      </button>

      {/* Always mounted and collapsed via grid-template-rows, not
          `{open && ...}`: unmounting leaves nothing to animate out. */}
      <div
        className="fc-blog-mtoc__panel"
        id="fc-blog-mtoc-panel"
        aria-hidden={!open}
      >
        <div className="fc-blog-mtoc__inner">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`fc-blog-mtoc__link${
                activeId === h.id ? ' fc-blog-mtoc__link--active' : ''
              }`}
              tabIndex={open ? undefined : -1}
              aria-current={activeId === h.id ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                scrollToHeading(h.id);
              }}
            >
              {h.text}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
