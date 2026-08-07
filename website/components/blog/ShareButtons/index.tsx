'use client';

import { useState, useCallback, useRef } from 'react';
import './styles.css';

interface ShareButtonsProps {
  url: string;
}

export function ShareButtons({ url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback — silently fail
    }
  }, [url]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        // User cancelled or share failed
      }
    }
  }, [url]);

  return (
    <div className="fc-blog-share">
      <button className="fc-blog-share__btn" onClick={handleCopy}>
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <button className="fc-blog-share__btn" onClick={handleShare}>
        Share
      </button>
    </div>
  );
}
