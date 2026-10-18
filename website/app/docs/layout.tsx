import type { ReactNode } from 'react';
import { DocsShell } from '@/components/docs/DocsShell';
import '@/components/docs/docs.css';

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
