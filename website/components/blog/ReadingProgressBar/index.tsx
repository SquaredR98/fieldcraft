'use client';

import { useEffect, useState } from 'react';
import './styles.css';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(100, (window.scrollY / scrollable) * 100));
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fc-blog-progress">
      <div
        className="fc-blog-progress__fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
