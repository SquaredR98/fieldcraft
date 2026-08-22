import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { NavMobile } from './NavMobile';
import './styles.css';

const links = [
  { label: 'Layers', href: '/#layers' },
  { label: 'Demos', href: '/#demos' },
  { label: 'Features', href: '/#features' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
];

export function Nav() {
  return (
    <nav className="fc-nav">
      <div className="fc-nav__inner">
        <Logo />
        <div className="fc-nav__links">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="fc-nav__link">
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link href="/pro" className="fc-nav__cta">Explore Pro →</Link>
        </div>
        <div className="fc-nav__mobile-actions">
          <ThemeToggle />
          <NavMobile />
        </div>
      </div>
    </nav>
  );
}
