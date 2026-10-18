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
  /** Whether the block is a terminal command */
  isTerminal?: boolean;
}

function isBashCode(
  lang?: string,
  title?: string,
  code?: string,
  isTerminal?: boolean,
): boolean {
  if (isTerminal) return true;
  const l = (lang || '').toLowerCase().trim();
  const t = (title || '').toLowerCase().trim();
  if (
    l === 'bash' ||
    l === 'sh' ||
    l === 'shell' ||
    l === 'zsh' ||
    t === 'terminal' ||
    t.endsWith('.sh') ||
    t.includes('bash')
  ) {
    return true;
  }
  if (code) {
    const trimmed = code.trimStart();
    if (
      trimmed.startsWith('pnpm ') ||
      trimmed.startsWith('npm ') ||
      trimmed.startsWith('yarn ') ||
      trimmed.startsWith('npx ') ||
      trimmed.startsWith('bun ') ||
      trimmed.startsWith('curl ') ||
      trimmed.startsWith('git ') ||
      trimmed.startsWith('docker ')
    ) {
      return true;
    }
  }
  return false;
}

export function DocsCodeBlock({
  children,
  title,
  lang,
  code,
  isTerminal,
}: DocsCodeBlockProps) {
  const isBash = isBashCode(lang, title, code, isTerminal);
  const displayLabel = title || (isBash ? 'bash' : lang);

  return (
    <div
      className={`fc-docs__code-block ${
        isBash ? 'fc-docs__code-block--bash' : 'fc-docs__code-block--code'
      }`}
    >
      <header className="fc-docs__code-chrome">
        <div className="fc-docs__code-chrome-left">
          {/* Three Chrome browser window dots */}
          <span className="fc-docs__code-lights" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>

          {/* Simple text right beside the 3 dots */}
          {displayLabel && (
            <span className="fc-docs__code-title">{displayLabel}</span>
          )}
        </div>

        <DocsCodeCopyButton code={code} />
      </header>

      <div className="fc-docs__code-block-content">{children}</div>
    </div>
  );
}
