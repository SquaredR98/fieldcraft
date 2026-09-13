'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import './styles.css';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    /*
     * Drop the transform once the rise has finished. A lingering
     * transform — even a zero one — makes this element a containing block
     * for `position: fixed` descendants, which offsets anything that
     * positions against the viewport (the Pro FormBuilder's dnd-kit drag
     * overlay being the case that caught this).
     */
    const settle = () => el.classList.add('fc-reveal-done');

    const reveal = () => {
      el.classList.add('fc-revealed');
      el.addEventListener('transitionend', settle, { once: true });
      // Fallback: transitionend does not fire if the transition is
      // interrupted, or at all under prefers-reduced-motion.
      timers.push(setTimeout(settle, 600));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (delay > 0) {
          timers.push(setTimeout(reveal, delay));
        } else {
          reveal();
        }
        observer.unobserve(el);
      },
      { threshold: 0.15 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      el.removeEventListener('transitionend', settle);
      timers.forEach(clearTimeout);
    };
  }, [delay]);

  return (
    <div ref={ref} className={`fc-scroll-reveal ${className}`}>
      {children}
    </div>
  );
}
