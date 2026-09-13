'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * Counts a figure up once, when it first scrolls into view.
 *
 * The spec strip is the page's evidence, and a number that ticks into
 * place reads as measured rather than asserted. Non-numeric values
 * (~27 KB) and reduced-motion users get the final value immediately,
 * and the DOM always carries the real figure for assistive tech.
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
  const [shown, setShown] = useState<string>(target === null ? value : '0');

  useEffect(() => {
    const el = ref.current;
    if (!el || target === null) return;

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduced) {
      setShown(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);

        const start = performance.now();
        let frame = 0;

        const tick = (now: number) => {
          const t = Math.min(Math.max((now - start) / DURATION, 0), 1);
          // Ease-out cubic: fast start, settles onto the figure.
          const eased = 1 - Math.pow(1 - t, 3);
          const n = Math.max(0, Math.round(target * eased));
          setShown(n.toLocaleString('en-GB'));
          if (t < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, value]);

  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
