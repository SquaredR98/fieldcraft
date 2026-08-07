import type { ReactNode } from 'react';
import { DocsTopBar } from '@/components/docs/DocsTopBar';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { DocsMobileSidebar } from '@/components/docs/DocsMobileSidebar';
import { docsNav } from '@/components/docs/docs-nav';
import '@/components/docs/docs.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <DocsTopBar />
      <div className="fc-docs">
        <DocsSidebar nav={docsNav} />
        <DocsMobileSidebar nav={docsNav} />
        {children}
      </div>
    </>
  );
}
