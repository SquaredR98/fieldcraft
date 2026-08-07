'use client';

import { useEffect, useState } from 'react';
import './styles.css';

interface Heading {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-66px 0px -80% 0px' }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="fc-blog-toc" aria-label="Table of contents">
      <div className="fc-blog-toc__heading">Contents</div>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`fc-blog-toc__link${activeId === h.id ? ' fc-blog-toc__link--active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
