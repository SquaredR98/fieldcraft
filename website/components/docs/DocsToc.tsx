'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useDocsShell } from './DocsShellContext';
import { cn } from '@/lib/utils';

interface TocItem {
  title: React.ReactNode;
  url: string;
  depth: number;
}

interface DocsTocProps {
  toc: TocItem[];
}

export function DocsToc({ toc }: DocsTocProps) {
  const { activeHeadingId, setActiveHeadingId, contentScrollRef, scrollToHeading } = useDocsShell();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headings = toc
      .map((item) => {
        const id = item.url.replace(/^#/, '');
        return document.getElementById(id);
      })
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const root = contentScrollRef.current;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        }
      },
      { root: root ?? undefined, rootMargin: '-20px 0px -70% 0px', threshold: 0 }
    );

    for (const heading of headings) {
      observerRef.current.observe(heading);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [toc, contentScrollRef, setActiveHeadingId]);

  // Only show h2 entries (depth 2)
  const h2Items = toc.filter((item) => item.depth === 2);

  if (h2Items.length === 0) return null;

  return (
    <aside className="fc-docs__toc" aria-label="Table of contents">
      <div className="fc-docs__toc-inner">
        <div className="fc-docs__toc-label">
          <span className="fc-docs__toc-indicator" />
          On this page
        </div>
        <nav className="fc-docs__toc-list">
          {h2Items.map((item) => {
            const id = item.url.replace(/^#/, '');
            const isActive = activeHeadingId === id;
            return (
              <a
                key={item.url}
                href={item.url}
                className={cn(
                  'fc-docs__toc-link',
                  isActive && 'fc-docs__toc-link--active'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(item.url);
                }}
              >
                {item.title}
              </a>
            );
          })}
        </nav>
        <div className="fc-docs__toc-extras">
          <a
            href="https://github.com/SquaredR98/fieldcraft/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Report an issue &rarr;
          </a>
          <a
            href="https://github.com/SquaredR98/fieldcraft/discussions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discussions
          </a>
          <Link href="/changelog">Changelog</Link>
        </div>
      </div>
    </aside>
  );
}
