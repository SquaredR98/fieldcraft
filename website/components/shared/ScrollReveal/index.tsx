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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => el.classList.add('fc-revealed'), delay);
          } else {
            el.classList.add('fc-revealed');
          }
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`fc-scroll-reveal ${className}`}>
      {children}
    </div>
  );
}
