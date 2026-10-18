'use client';

import { useState, useCallback } from 'react';

export function DocsCodeCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    try {
      navigator.clipboard.writeText(code);
    } catch {
      // Fallback silently
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, [code]);

  return (
    <button
      className={`fc-docs__code-copy ${copied ? 'fc-docs__code-copy--copied' : ''}`}
      onClick={handleCopy}
      type="button"
      aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
      title={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <>
          <svg
            className="fc-docs__code-copy-icon"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Copied</span>
        </>
      ) : (
        <>
          <svg
            className="fc-docs__code-copy-icon"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
