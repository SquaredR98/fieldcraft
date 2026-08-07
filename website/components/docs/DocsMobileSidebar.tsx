'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { DocNavSection } from './docs-types';

interface DocsMobileSidebarProps {
  nav: DocNavSection[];
}

export function DocsMobileSidebar({ nav }: DocsMobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        className="fc-docs__mobile-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close docs navigation' : 'Open docs navigation'}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        >
          {open ? (
            <>
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </>
          ) : (
            <>
              <line x1="2" y1="4" x2="14" y2="4" />
              <line x1="2" y1="8" x2="14" y2="8" />
              <line x1="2" y1="12" x2="14" y2="12" />
            </>
          )}
        </svg>
        <span>Documentation</span>
      </button>

      <div
        className={cn(
          'fc-docs__mobile-overlay',
          open && 'fc-docs__mobile-overlay--open'
        )}
        onClick={() => setOpen(false)}
      >
        <div
          className="fc-docs__mobile-drawer"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="fc-docs__mobile-drawer-header">
            <span className="fc-docs__mobile-drawer-label">Docs</span>
            <button
              className="fc-docs__mobile-drawer-close"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              >
                <line x1="4" y1="4" x2="14" y2="14" />
                <line x1="14" y1="4" x2="4" y2="14" />
              </svg>
            </button>
          </div>

          {nav.map((section) => (
            <div key={section.label} className="fc-docs__sidebar-group">
              <div className="fc-docs__sidebar-group-label">
                {section.label}
              </div>
              <div className="fc-docs__sidebar-links">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'fc-docs__sidebar-link',
                      pathname === item.href && 'fc-docs__sidebar-link--active'
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="fc-docs__sidebar-badge">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
