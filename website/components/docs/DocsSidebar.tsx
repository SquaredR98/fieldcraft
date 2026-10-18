'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { DocNavSection } from './docs-types';

interface DocsSidebarProps {
  nav: DocNavSection[];
  onItemClick?: () => void;
}

export function DocsSidebar({ nav, onItemClick }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fc-docs__sidebar" aria-label="Documentation sidebar">
      <div className="fc-docs__sidebar-inner">
        {nav.map((section) => (
          <div key={section.label} className="fc-docs__sidebar-group">
            <div className="fc-docs__sidebar-group-label">{section.label}</div>
            <div className="fc-docs__sidebar-links">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={cn(
                      'fc-docs__sidebar-link',
                      isActive && 'fc-docs__sidebar-link--active'
                    )}
                  >
                    <span className="fc-docs__sidebar-link-text">{item.title}</span>
                    {item.badge && (
                      <span className="fc-docs__sidebar-badge">{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
