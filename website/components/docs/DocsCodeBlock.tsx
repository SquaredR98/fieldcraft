'use client';

import { DocsCodeCopyButton } from './DocsCodeCopyButton';

interface DocsCodeBlockProps {
  /** The pre-highlighted <pre> element from rehypeCode/Shiki */
  children: React.ReactNode;
  /** File label shown in the header bar */
  title?: string;
  /** Language label shown in the header bar when no title */
  lang?: string;
  /** Plain text of the code for the copy button */
  code: string;
}

export function DocsCodeBlock({ children, title, lang, code }: DocsCodeBlockProps) {
  return (
    <div className="fc-docs__code-block">
      {(title || lang) && (
        <div className="fc-docs__code-block-header">
          <span className="fc-docs__code-block-file">
            {title || lang}
          </span>
          <DocsCodeCopyButton code={code} />
        </div>
      )}
      <div className="fc-docs__code-block-content">
        {children}
      </div>
    </div>
  );
}
