import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function DocsTopBar() {
  return (
    <div className="fc-docs-topbar">
      <div className="fc-docs-topbar__inner">
        <a href="/" className="fc-docs-topbar__logo">
          <div className="fc-docs-topbar__logo-mark">
            <div className="fc-docs-topbar__logo-bar fc-docs-topbar__logo-bar--outline" />
            <div className="fc-docs-topbar__logo-bar fc-docs-topbar__logo-bar--filled" />
            <div className="fc-docs-topbar__logo-bar fc-docs-topbar__logo-bar--amber" />
          </div>
          <div className="fc-docs-topbar__logo-text">
            <div className="fc-docs-topbar__logo-name">FieldCraft</div>
            <div className="fc-docs-topbar__logo-sub">by SquaredR</div>
          </div>
        </a>

        <div className="fc-docs-topbar__badge">Docs</div>

        <div className="fc-docs-topbar__search">
          <span className="fc-docs-topbar__search-slash">/</span>
          <span className="fc-docs-topbar__search-placeholder">
            Search the docs
          </span>
          <span className="fc-docs-topbar__search-kbd">⌘K</span>
        </div>

        <div className="fc-docs-topbar__actions">
          <div className="fc-docs-topbar__version">
            <span>v1.3.14</span>
            <span className="fc-docs-topbar__version-caret">&#9662;</span>
          </div>
          <a
            href="https://github.com/SquaredR98/fieldcraft"
            className="fc-docs-topbar__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a href="/" className="fc-docs-topbar__link">
            Site
          </a>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
