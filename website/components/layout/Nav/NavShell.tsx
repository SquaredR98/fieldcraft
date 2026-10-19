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
/* Reading progress only appears when there is enough page to be worth
   tracking. Below this the bar would sit at or near 100% for the whole
   visit, which says nothing — a full teal line on the homepage reads as
   decoration, not as progress. 1.5 viewports of SCROLLABLE distance is
   roughly where a reader starts losing track of how far in they are. */
const PROGRESS_MIN_SCROLL = 1.5;

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

      // Reading progress, written as a CSS custom property on the same
      // element in the same rAF frame. Folded into this loop rather
      // than given its own listener: the previous ReadingProgressBar
      // was a separate `fixed` element running setState on every
      // scroll event — 60 React renders a second to move one line, and
      // because it sat outside the header it stayed pinned while the
      // header translated away, leaving a stray line floating over the
      // page. Living here it rides the same transform.
      //
      // Set BEFORE the early return below, or it would freeze at
      // whatever value it held while near the top of the page.
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const worthTracking =
        scrollable > window.innerHeight * PROGRESS_MIN_SCROLL;

      // An attribute, not a class: CSS decides whether to paint, so a
      // short page shows nothing at all rather than a line sitting at
      // 100%. Re-evaluated every frame because the document can grow
      // after load (images, embeds, a filter changing the list).
      el.dataset.progress = worthTracking ? 'true' : 'false';
      if (worthTracking) {
        el.style.setProperty(
          '--fc-read-progress',
          `${Math.min(100, (y / scrollable) * 100)}%`
        );
      }

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

    // The page height is not fixed at mount: fonts swap, images load,
    // a filter changes the list. Without this a page that only becomes
    // long enough to track AFTER load would never show the bar, and
    // one that shrinks would keep it.
    const ro = new ResizeObserver(onScroll);
    ro.observe(document.documentElement);

    return () => {
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <header
      ref={ref}
      className="fc-nav"
      data-pinned="true"
      data-hidden="false"
      /* Starts false so nothing paints before the first measurement —
         a page that turns out to be short never flashes a bar. */
      data-progress="false"
    >
      {children}
    </header>
  );
}
