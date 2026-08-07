'use client';

import { useEffect, useState, useRef } from 'react';
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
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headings = toc
      .map((item) => {
        const id = item.url.replace('#', '');
        return document.getElementById(id);
      })
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    for (const heading of headings) {
      observerRef.current.observe(heading);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [toc]);

  // Only show h2 entries (depth 2)
  const h2Items = toc.filter((item) => item.depth === 2);

  if (h2Items.length === 0) return null;

  return (
    <div className="fc-docs__toc">
      <div className="fc-docs__toc-label">On this page</div>
      <div className="fc-docs__toc-list">
        {h2Items.map((item) => {
          const id = item.url.replace('#', '');
          return (
            <a
              key={item.url}
              href={item.url}
              className={cn(
                'fc-docs__toc-link',
                activeId === id && 'fc-docs__toc-link--active'
              )}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setActiveId(id);
                }
              }}
            >
              {item.title}
            </a>
          );
        })}
      </div>
      <div className="fc-docs__toc-extras">
        <a href="#">Report an issue</a>
        <a href="#">Discussions</a>
        <a href="#">Changelog</a>
      </div>
    </div>
  );
}
