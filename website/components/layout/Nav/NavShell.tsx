'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/*
 * Scroll behaviour only. Nothing else.
 *
 * This takes `children` so the nav's actual content — logo, links, CTA —
 * stays a SERVER component and is passed through. Making the whole nav
 * client to get a scroll listener would ship the links array, the logo and
 * the GitHub icon markup to the browser for no reason.
 *
 * Hides on scroll down (you are reading, get out of the way) and returns
 * on any upward scroll (you are looking for something). Always visible at
 * the top of the page.
 *
 * Deliberately writes a DATA ATTRIBUTE rather than setState: this runs on
 * every scroll event, and re-rendering React 60 times a second to toggle a
 * class is waste. The DOM write is the whole update, and CSS does the rest.
 */

/* Ignore jitter and trackpad noise — only a deliberate gesture counts. */
const DELTA = 6;
/* Above this, the bar is pinned open regardless of direction: near the top
   there is nothing to get out of the way of. */
const TOP = 80;

export function NavShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let last = window.scrollY;
    let ticking = false;

    const apply = () => {
      ticking = false;
      const y = window.scrollY;

      // At the top: always open, and flagged so the bar can drop its
      // shadow while it has nothing to float above.
      if (y <= TOP) {
        el.dataset.pinned = 'true';
        el.dataset.hidden = 'false';
        last = y;
        return;
      }

      el.dataset.pinned = 'false';

      const diff = y - last;
      if (Math.abs(diff) > DELTA) {
        el.dataset.hidden = diff > 0 ? 'true' : 'false';
        last = y;
      }
    };

    const onScroll = () => {
      // rAF-throttled: scroll fires far more often than the screen
      // refreshes, and the listener is passive so it never blocks it.
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      ref={ref}
      className="fc-nav"
      data-pinned="true"
      data-hidden="false"
    >
      {children}
    </header>
  );
}
