'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';
import './styles.css';

/*
 * Window chrome around an MDX code block, matching the docs treatment:
 * three lights, the language, and a copy button.
 *
 * It wraps rather than replaces the <pre> that rehype-pretty-code
 * produces, so the Shiki highlighting and its dual-theme token colours
 * are untouched.
 *
 * The copy reads from the DOM rather than taking the source as a prop:
 * MDX hands this component React children, not the original string,
 * and re-serialising a node tree back to text would lose exactly the
 * whitespace that matters in code.
 */
export function BlogCodeBlock({
  children,
  language,
}: {
  children: ReactNode;
  language?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const pre = ref.current?.querySelector('pre');
    if (!pre) return;

    /* Read the .line spans and join with newlines rather than taking
       pre.textContent. The lines are grid items, and textContent
       concatenates them with no separator — so a copied block would
       come back as one run-on line. Line numbers are ::before
       content, so they are never part of this. */
    const lines = pre.querySelectorAll('[data-line]');
    const text = lines.length
      ? Array.from(lines)
          .map((l) => l.textContent ?? '')
          .join('\n')
          .replace(/\n+$/, '')
      : (pre.textContent ?? '');

    if (!text) return;
    try {
      /* Can throw in an insecure context (plain http on a LAN IP), so
         the state only flips on success. */
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* Nothing useful to show the reader — the code is on screen. */
    }
  }, []);

  return (
    <div className="fc-blog-code" ref={ref}>
      <div className="fc-blog-code__chrome">
        <div className="fc-blog-code__lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        {language && (
          <span className="fc-blog-code__lang">{language}</span>
        )}
        <button
          type="button"
          className={`fc-blog-code__copy${copied ? ' fc-blog-code__copy--copied' : ''}`}
          onClick={handleCopy}
          aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {children}
    </div>
  );
}
