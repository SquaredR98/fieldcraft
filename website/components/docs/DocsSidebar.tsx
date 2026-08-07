'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { DocNavSection } from './docs-types';

interface DocsSidebarProps {
  nav: DocNavSection[];
}

export function DocsSidebar({ nav }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="fc-docs__sidebar">
      {nav.map((section) => (
        <div key={section.label} className="fc-docs__sidebar-group">
          <div className="fc-docs__sidebar-group-label">{section.label}</div>
          <div className="fc-docs__sidebar-links">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'fc-docs__sidebar-link',
                  pathname === item.href && 'fc-docs__sidebar-link--active'
                )}
              >
                <span>{item.title}</span>
                {item.badge && (
                  <span className="fc-docs__sidebar-badge">{item.badge}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
