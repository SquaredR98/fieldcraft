'use client';

import type { ReactNode } from 'react';
import { DocsShellProvider } from './DocsShellContext';
import { DocsTopBar } from './DocsTopBar';
import { DocsSidebar } from './DocsSidebar';
import { DocsMobileNav } from './DocsMobileNav';
import { docsNav } from './docs-nav';

interface DocsShellProps {
  children: ReactNode;
}

export function DocsShell({ children }: DocsShellProps) {
  return (
    <DocsShellProvider>
      <div className="fc-docs-frame">
        <div className="fc-docs-shell">
          <DocsTopBar />
          <div className="fc-docs-shell__body">
            <DocsSidebar nav={docsNav} />
            <DocsMobileNav nav={docsNav} />
            {children}
          </div>
        </div>
      </div>
    </DocsShellProvider>
  );
}
