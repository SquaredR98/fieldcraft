'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
}

/*
 * Which heading is currently in view.
 *
 * Extracted from TableOfContents so the desktop sidebar and the mobile
 * disclosure track the same heading from one observer each rather than
 * drifting apart — the mobile control shows the active heading as its
 * label, so it needs exactly what the sidebar highlights.
 */
export function useActiveHeading(headings: Heading[]): string {
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
      /* Top margin matches --fc-nav-space (5.25rem = 84px), the
         clearance the floating header needs. It was -66px, measured
         against the old welded bar, so a heading counted as "active"
         while still behind the nav. */
      { rootMargin: '-84px 0px -80% 0px' }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

/*
 * Scroll a heading to just below the floating header.
 *
 * `scrollIntoView` aligns to y=0, which is behind the bar — the same
 * reason section[id] carries scroll-margin-top in the nav stylesheet.
 */
export function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const navSpace = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--fc-nav-space'
    )
  );
  /* The token is in rem; fall back to 84px if it is missing or NaN. */
  const offset = Number.isNaN(navSpace)
    ? 84
    : navSpace * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

  const top = el.getBoundingClientRect().top + window.scrollY - offset - 16;
  window.scrollTo({ top, behavior: 'smooth' });
}

export type { Heading };
