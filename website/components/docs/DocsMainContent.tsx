'use client';

import { useDocsShell } from './DocsShellContext';
import type { ReactNode } from 'react';

export function DocsMainContent({ children }: { children: ReactNode }) {
  const { contentScrollRef } = useDocsShell();

  return (
    <div
      ref={contentScrollRef}
      id="fc-docs-main-scroll"
      className="fc-docs__main-scroll"
      tabIndex={-1}
    >
      {children}
    </div>
  );
}
