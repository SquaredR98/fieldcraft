import { CopyInstall } from '@/components/shared/CopyInstall';
import { HeroTabs } from './HeroTabs';
import { SpecStrip } from './SpecStrip';
import './styles.css';

/*
 * The hero makes one claim: submissions never pass through anyone else's
 * servers. Capability comes later — every form library has field types,
 * but a hosted service structurally cannot make this promise.
 */

const badges = ['MIT', 'TypeScript', 'React 18 & 19'];

export function Hero() {
  return (
    <section id="top" className="fc-hero">
      <div className="fc-v2-grid" aria-hidden="true" />
      <div className="fc-hero__inner">
        <div>
          <div className="fc-hero__eyebrow">
            <div className="fc-hero__eyebrow-dot" />
            Self-hosted &middot; MIT licensed
          </div>
          <h1 className="fc-hero__h1">
            Your forms. Your database.<br />
            Nobody in the middle.
          </h1>
          <div className="fc-hero__tick" />
          <p className="fc-hero__sub">
            FieldCraft is a schema-driven form engine for React. Describe a form
            once in JSON and it handles validation, conditional logic,
            multi-step navigation, drafts and submission.
          </p>
          <p className="fc-hero__sub fc-hero__sub--quiet">
            It is a library, not a service. Responses go straight from the
            browser to infrastructure you control &mdash; there is no vendor in
            the path to trust, audit or pay.
          </p>
          {/* Explore Builder leads: seeing the product beats reading about
              it, so docs drop to the secondary tier. */}
          <div className="fc-hero__actions">
            <a href="#builder" className="fc-v2-cta">
              Explore Builder <span className="fc-v2-cta__arrow">→</span>
            </a>
            <a href="/docs" className="fc-v2-btn">
              Read the docs
            </a>
          </div>
          {/* Own row: it is a command to copy, not a second CTA competing
              for the same click. */}
          <div className="fc-hero__install">
            <CopyInstall />
          </div>
          <div className="fc-hero__badges">
            {badges.map((b) => (
              <div key={b} className="fc-v2-chip">{b}</div>
            ))}
          </div>
        </div>
        <HeroTabs />
      </div>
      <SpecStrip />
    </section>
  );
}
