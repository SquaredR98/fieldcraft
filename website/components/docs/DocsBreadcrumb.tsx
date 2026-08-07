'use client';

import { usePathname } from 'next/navigation';
import type { DocNavSection } from './docs-types';

interface DocsBreadcrumbProps {
  nav: DocNavSection[];
}

export function DocsBreadcrumb({ nav }: DocsBreadcrumbProps) {
  const pathname = usePathname();

  const section = nav.find((s) =>
    s.items.some((item) => item.href === pathname)
  );
  const page = section?.items.find((item) => item.href === pathname);

  if (!page) return null;

  return (
    <div className="fc-docs__breadcrumb">
      {section && (
        <>
          {section.label} / {page.title}
        </>
      )}
    </div>
  );
}
