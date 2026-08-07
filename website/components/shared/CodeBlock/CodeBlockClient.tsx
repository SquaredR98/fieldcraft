'use client';

import { useEffect, useRef, useState } from 'react';
import './styles.css';

type CodeBlockClientProps = {
  code: string;
  lang: 'json' | 'tsx' | 'bash' | 'typescript';
  className?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let highlighterPromise: Promise<any> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then((mod) =>
      mod.createHighlighter({
        themes: ['vitesse-light', 'vitesse-dark'],
        langs: ['json', 'tsx', 'bash', 'typescript'],
      }),
    );
  }
  return highlighterPromise;
}

export function CodeBlockClient({ code, lang, className = '' }: CodeBlockClientProps) {
  const [html, setHtml] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    getHighlighter().then((highlighter) => {
      if (cancelled) return;
      const result = highlighter.codeToHtml(code, {
        lang,
        themes: {
          light: 'vitesse-light',
          dark: 'vitesse-dark',
        },
      });
      setHtml(result);
    });

    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  return (
    <div className={`fc-code-block ${className}`}>
      {html ? (
        <div
          ref={containerRef}
          className="fc-code-block__content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="fc-code-block__content">
          <pre className="fc-code-block__placeholder">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
