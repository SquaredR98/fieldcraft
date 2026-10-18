'use client';

import { useState } from 'react';
import { useDocsShell } from './DocsShellContext';
import { cn } from '@/lib/utils';

interface TocItem {
  title: React.ReactNode;
  url: string;
  depth: number;
}

interface DocsMobileTocDropdownProps {
  toc: TocItem[];
}

export function DocsMobileTocDropdown({ toc }: DocsMobileTocDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { activeHeadingId, scrollToHeading } = useDocsShell();

  // Filter to h2 items only (depth === 2)
  const items = toc.filter((item) => item.depth === 2);

  if (items.length === 0) return null;

  // Find currently active item title if any
  const activeItem = items.find((item) => item.url.replace(/^#/, '') === activeHeadingId);

  const handleSelect = (url: string) => {
    scrollToHeading(url);
    setIsOpen(false);
  };

  return (
    <div className="fc-docs-mobile-toc lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fc-docs-mobile-toc__trigger"
        aria-expanded={isOpen}
      >
        <div className="fc-docs-mobile-toc__label">
          <svg
            className="fc-docs-mobile-toc__icon"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M2.5 4h11M2.5 8h7.5M2.5 12h10" />
          </svg>
          <span className="fc-docs-mobile-toc__tag">On this page</span>
          <span className="fc-docs-mobile-toc__current">
            {activeItem?.title || 'Jump to section'}
          </span>
        </div>
        <svg
          className={cn(
            'fc-docs-mobile-toc__chevron',
            isOpen && 'fc-docs-mobile-toc__chevron--open'
          )}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      {isOpen && (
        <div className="fc-docs-mobile-toc__menu animate-in fade-in zoom-in-95 duration-100">
          <div className="fc-docs-mobile-toc__list">
            {items.map((item) => {
              const id = item.url.replace(/^#/, '');
              const isActive = activeHeadingId === id;
              return (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => handleSelect(item.url)}
                  className={cn(
                    'fc-docs-mobile-toc__item',
                    isActive && 'fc-docs-mobile-toc__item--active'
                  )}
                >
                  <span className="fc-docs-mobile-toc__item-bullet" />
                  <span className="fc-docs-mobile-toc__item-text">{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
