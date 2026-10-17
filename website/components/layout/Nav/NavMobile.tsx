'use client';

import { useState } from 'react';
import Link from 'next/link';

import { NAV_LINKS } from './links';

export function NavMobile() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fc-nav__hamburger"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        >
          {open ? (
            <>
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </>
          ) : (
            <>
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="fc-nav__drawer">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="fc-nav__drawer-link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/SquaredR98/fieldcraft"
            target="_blank"
            rel="noopener noreferrer"
            className="fc-nav__drawer-link"
            onClick={() => setOpen(false)}
          >
            GitHub
          </a>
          {/* Docs is the CTA here too, matching the desktop bar. */}
          <Link
            href="/docs"
            className="fc-nav__drawer-cta"
            onClick={() => setOpen(false)}
          >
            Docs →
          </Link>
        </div>
      )}
    </>
  );
}
