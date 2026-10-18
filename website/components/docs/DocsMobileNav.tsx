'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDocsShell } from './DocsShellContext';
import { cn } from '@/lib/utils';
import type { DocNavSection } from './docs-types';

interface DocsMobileNavProps {
  nav: DocNavSection[];
}

export function DocsMobileNav({ nav }: DocsMobileNavProps) {
  const { isMobileNavOpen, closeMobileNav } = useDocsShell();
  const pathname = usePathname();

  if (!isMobileNavOpen) return null;

  return (
    <div
      className="fc-docs__mobile-nav md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Documentation navigation"
    >
      <div className="fc-docs__mobile-nav-header">
        <button
          type="button"
          onClick={closeMobileNav}
          className="fc-docs__mobile-nav-close"
          aria-label="Close navigation"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="fc-docs__mobile-nav-content">
        {nav.map((section) => (
          <div key={section.label} className="fc-docs__mobile-nav-group">
            <div className="fc-docs__mobile-nav-group-label">
              <span className="fc-docs__mobile-nav-group-dot" />
              {section.label}
            </div>
            <div className="fc-docs__mobile-nav-links">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileNav}
                    className={cn(
                      'fc-docs__mobile-nav-link',
                      isActive && 'fc-docs__mobile-nav-link--active'
                    )}
                  >
                    <span className="fc-docs__mobile-nav-link-title">{item.title}</span>
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
    </div>
  );
}
