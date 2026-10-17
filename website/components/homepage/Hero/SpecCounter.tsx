'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * Counts a figure up once, when it first scrolls into view.
 *
 * The spec strip is the page's evidence, and a number that ticks into
 * place reads as measured rather than asserted — but the animation is a
 * garnish, so it is strictly opt-in: the real figure renders first and
 * the count-up only takes over once it is certain it can run. Anything
 * that cannot animate (reduced motion, no IntersectionObserver, no rAF,
 * no JS at all) simply keeps the correct number.
 *
 * Non-numeric values like "~28 KB" have nothing to count and are left
 * alone. The DOM always carries the true figure in aria-label, so
 * assistive tech never sees an intermediate frame.
 */

const DURATION = 900;

function parse(value: string): number | null {
  const digits = value.replace(/[^0-9]/g, '');
  if (!digits || !/^[0-9,]+$/.test(value)) return null;
  return Number(digits);
}

export function SpecCounter({ value }: { value: string }) {
  const target = parse(value);
  const ref = useRef<HTMLSpanElement>(null);

  /*
   * The REAL value is the default, and the count-up only takes over once
   * it has been confirmed it can actually run.
   *
   * This used to start at '0' and wait for an IntersectionObserver. That
   * made 0 the fallback for every failure — observer never fires, the
   * threshold is never met, JS is off, hydration has not finished — and a
   * confident "0 input field types" on the page that is supposed to be
   * the evidence is far worse than no animation at all. It showed up on
   * mobile, where the single-column cells are short flex rows and the
   * 0.6 threshold on the inner span was not reliably reached.
   *
   * So: server-render the figure, and only drop to 0 inside the effect,
   * at the moment the animation starts. If anything prevents it, the
   * correct number is already on screen.
   */
  const [shown, setShown] = useState<string>(value);

  useEffect(() => {
    const el = ref.current;
    // Non-numeric ("~28 KB") has nothing to count, so it stays as-is.
    if (!el || target === null) return;

    // Three reasons not to animate, all ending with the true value shown.
    const reduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const canObserve = typeof IntersectionObserver !== 'undefined';
    const canAnimate = typeof requestAnimationFrame !== 'undefined';
    if (reduced || !canObserve || !canAnimate) return;

    let frame = 0;

    const run = () => {
      const start = performance.now();
      // Only now does 0 appear — after the animation is committed, so it
      // can never be a resting state.
      const tick = (now: number) => {
        const t = Math.min(Math.max((now - start) / DURATION, 0), 1);
        // Ease-out cubic: fast start, settles onto the figure.
        const eased = 1 - Math.pow(1 - t, 3);
        const n = Math.max(0, Math.round(target * eased));
        setShown(n.toLocaleString('en-GB'));
        if (t < 1) frame = requestAnimationFrame(tick);
        // Final frame assigns the formatted source value rather than a
        // recomputed one, so "1,384" cannot drift from its label.
        else setShown(value);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);
        run();
      },
      // Threshold 0 with a margin: the element only has to touch the
      // viewport. 0.6 required 60% of an inline span to be visible, which
      // short flex rows on mobile did not reliably satisfy — and when it
      // was not satisfied the counter simply never ran.
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, value]);

  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
