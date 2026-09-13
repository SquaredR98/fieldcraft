'use client';

import { useCallback, useState } from 'react';
import './styles.css';

const INSTALL_CMD = 'npm i @squaredr/fieldcraft-react';

export function CopyInstall() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission).
      // The command is visible and selectable either way.
    }
  }, []);

  return (
    <button
      type="button"
      className="fc-copy-install"
      onClick={handleCopy}
      aria-label={`Copy install command: ${INSTALL_CMD}`}
    >
      <span className="fc-copy-install__prompt" aria-hidden="true">
        $
      </span>
      <span>{INSTALL_CMD}</span>
      <span
        className={`fc-copy-install__label${
          copied ? ' fc-copy-install__label--copied' : ''
        }`}
        aria-live="polite"
      >
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  );
}
