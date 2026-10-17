import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { NavShell } from './NavShell';
import { NavMobile } from './NavMobile';
import { NAV_LINKS } from './links';
import './styles.css';

/*
 * A SERVER component. The only client code in the header is NavShell,
 * which does nothing but watch scroll direction, and NavMobile, which owns
 * the drawer. Everything below — the links, the logo, the CTA, the GitHub
 * icon — is rendered on the server and passed through as children.
 *
 * The hover-blur effect looks like it needs JavaScript and does not: CSS
 * `:has()` lets the container react to a hovered child, so the row can
 * blur its non-hovered links with no state and no listener.
 *
 * `Docs` is the CTA now, so it is NOT in the link list — it would
 * otherwise appear twice. "Explore Pro" is gone with the rest of the Pro
 * surfaces. The list itself lives in ./links so the desktop bar and the
 * mobile drawer cannot drift apart, which they had.
 */
export function Nav() {
  return (
    <NavShell>
      <nav className="fc-nav__inner" aria-label="Main">
        <Logo />

        <div className="fc-nav__links">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="fc-nav__link">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="fc-nav__actions">
          <a
            href="https://github.com/SquaredR98/fieldcraft"
            target="_blank"
            rel="noopener noreferrer"
            className="fc-nav__github"
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

          <Link href="/docs" className="fc-nav__cta">
            Docs <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="fc-nav__mobile-actions">
          <NavMobile />
        </div>
      </nav>
    </NavShell>
  );
}
