'use client';

import { useCallback, useState } from 'react';
import './styles.css';

const INSTALL_CMD = 'npm i @squaredr/fieldcraft-react';

export function CopyInstall() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, []);

  return (
    <div className="fc-copy-install" onClick={handleCopy} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCopy(); } }}>
      <span>{INSTALL_CMD}</span>
      <span className="fc-copy-install__label">{copied ? 'COPIED' : 'COPY'}</span>
    </div>
  );
}
