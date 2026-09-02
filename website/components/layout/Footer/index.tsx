import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import './styles.css';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const columns: FooterColumn[] = [
  {
    title: 'The project',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Demos', href: '/#demos' },
      { label: 'Templates', href: '/templates' },
      { label: 'Known gaps', href: '/#gaps' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Code',
    links: [
      { label: 'GitHub', href: 'https://github.com/SquaredR98/fieldcraft', external: true },
      { label: 'npm packages', href: 'https://www.npmjs.com/org/squaredr', external: true },
      { label: 'Report an issue', href: 'https://github.com/SquaredR98/fieldcraft/issues', external: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Licence', href: '/legal/license' },
      { label: 'Terms of service', href: '/legal/terms' },
      { label: 'Privacy policy', href: '/legal/privacy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="fc-footer">
      <div className="fc-footer__grid">
        <div>
          <div style={{ marginBottom: 14 }}>
            <Logo />
          </div>
          <div className="fc-footer__brand-desc">
            A schema-driven form engine for React. Built to learn, shared in
            case it&rsquo;s useful.
          </div>
          <div className="fc-footer__brand-url">fieldcraft.squaredr.tech</div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <div className="fc-footer__col-title">{col.title}</div>
            <div className="fc-footer__col-links">
              {col.links.map((link) =>
                link.external ? (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} href={link.href}>
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="fc-footer__bottom">
        <div className="fc-footer__bottom-inner">
          <div>&copy; 2026 SquaredR &middot; MIT licensed</div>
          <div className="fc-footer__bottom-note">Built in my spare time</div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
