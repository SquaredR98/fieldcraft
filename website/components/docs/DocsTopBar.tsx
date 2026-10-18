'use client';

import Link from 'next/link';
import { useDocsShell } from './DocsShellContext';

export function DocsTopBar() {
  const { isMobileNavOpen, toggleMobileNav } = useDocsShell();

  return (
    <header className="fc-docs-topbar">
      <div className="fc-docs-topbar__inner">
        <div className="fc-docs-topbar__left">
          {/* Logo with Version below the wordmark */}
          <Link href="/docs" className="fc-docs-topbar__logo">
            <div className="fc-docs-topbar__logo-mark" aria-hidden="true">
              <div className="fc-docs-topbar__logo-bar fc-docs-topbar__logo-bar--outline" />
              <div className="fc-docs-topbar__logo-bar fc-docs-topbar__logo-bar--filled" />
              <div className="fc-docs-topbar__logo-bar fc-docs-topbar__logo-bar--amber" />
            </div>
            <div className="fc-docs-topbar__logo-text">
              <span className="fc-docs-topbar__logo-name">FieldCraft</span>
              <span className="fc-docs-topbar__logo-version">v1.13.0</span>
            </div>
          </Link>
        </div>

        {/* Search trigger (hidden on mobile screens) */}
        <div className="fc-docs-topbar__search">
          <span className="fc-docs-topbar__search-slash">/</span>
          <span className="fc-docs-topbar__search-placeholder">
            Search docs...
          </span>
          <span className="fc-docs-topbar__search-kbd">⌘K</span>
        </div>

        {/* Technical Control Strip on Right: GitHub Icon + Home Icon + Mobile Hamburger */}
        <div className="fc-docs-topbar__actions">
          <div className="fc-docs-topbar__strip">
            <a
              href="https://github.com/SquaredR98/fieldcraft"
              className="fc-docs-topbar__strip-btn"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub repository"
              aria-label="GitHub repository"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
            </a>

            <div className="fc-docs-topbar__strip-divider" aria-hidden="true" />

            <Link
              href="/"
              className="fc-docs-topbar__strip-btn"
              title="Return to homepage"
              aria-label="Return to homepage"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </Link>

            {/* Mobile Hamburger toggle integrated into the control strip */}
            <div className="fc-docs-topbar__strip-divider fc-docs-topbar__hamburger-divider" aria-hidden="true" />

            <button
              type="button"
              onClick={toggleMobileNav}
              className="fc-docs-topbar__strip-btn fc-docs-topbar__hamburger"
              aria-label={isMobileNavOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isMobileNavOpen}
              title={isMobileNavOpen ? 'Close menu' : 'Open docs menu'}
            >
              {isMobileNavOpen ? (
                <svg
                  width="18"
                  height="18"
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
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
