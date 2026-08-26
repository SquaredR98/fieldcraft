import { CopyInstall } from '@/components/shared/CopyInstall';
import { GitHubStars } from '@/components/shared/GitHubStars';
import { HeroTabs } from './HeroTabs';
import { SpecStrip } from './SpecStrip';
import './styles.css';

const badges = [
  'MIT',
  'One dependency \u00b7 zod',
  'TypeScript native',
  'React 18 & 19',
];

export function Hero() {
  return (
    <section id="top" className="fc-hero">
      <div className="fc-hero__inner">
        <div>
          <div className="fc-hero__eyebrow">
            <div className="fc-hero__eyebrow-dot" />
            Open source &middot; MIT licensed &middot; self-hosted
          </div>
          <h1 className="fc-hero__h1">
            Forms are code.<br />
            Treat them that way.
          </h1>
          <p className="fc-hero__sub">
            FieldCraft is a schema-driven form engine for React. Define a form
            once in JSON — validation, conditional logic, multi-step navigation,
            drafts and submission are handled. In your repo, on your
            infrastructure, with your database.
          </p>
          <div className="fc-hero__actions">
            <a href="/docs" className="fc-hero__cta">Get started →</a>
            <CopyInstall />
          </div>
          <div className="fc-hero__badges">
            {badges.map((b) => (
              <div key={b} className="fc-hero__badge">{b}</div>
            ))}
            <GitHubStars />
          </div>
        </div>
        <HeroTabs />
      </div>
      <SpecStrip />
    </section>
  );
}
