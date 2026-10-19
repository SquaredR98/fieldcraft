'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import './styles.css';

interface ShareButtonsProps {
  url: string;
}

export function ShareButtons({ url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      /* Throws in an insecure context (plain http on a LAN IP). The
         state only flips on success, so nothing claims to have
         copied when it has not. */
    }
  }, [url]);

  /* Always rendered, never feature-gated.
     navigator.share is a SECURE-CONTEXT api, so it is absent on a
     plain-http LAN address — which is exactly how this gets tested on
     a phone. Gating the button on it meant the control disappeared
     during local testing and reappeared only in production, which is
     worse than a button that degrades. It falls back to copying the
     link, so it always does something useful. */
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        /* Cancelled by the user, or the sheet failed to open. Fall
           through to the copy fallback rather than doing nothing. */
      }
    }
    void handleCopy();
  }, [url, handleCopy]);

  return (
    <div className="fc-blog-share">
      <button
        type="button"
        className={`fc-blog-share__btn${copied ? ' fc-blog-share__btn--done' : ''}`}
        onClick={handleCopy}
        title={copied ? 'Link copied' : 'Copy link'}
        aria-label={copied ? 'Link copied to clipboard' : 'Copy link to clipboard'}
      >
        {copied ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          /* Chain link, the conventional "copy link" mark. */
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>

      <div className="fc-blog-share__divider" aria-hidden="true" />
      <button
        type="button"
        className="fc-blog-share__btn"
        onClick={handleShare}
        title="Share"
        aria-label="Share this post"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.59 13.51 6.83 3.98M15.41 6.51 8.59 10.49" />
        </svg>
      </button>
    </div>
  );
}
