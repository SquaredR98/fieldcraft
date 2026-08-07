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
      className="fc-docs__code-block-copy"
      onClick={handleCopy}
      type="button"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
