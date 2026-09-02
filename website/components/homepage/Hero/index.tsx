import { CopyInstall } from '@/components/shared/CopyInstall';
import { HeroTabs } from './HeroTabs';
import { SpecStrip } from './SpecStrip';
import './styles.css';

const badges = ['MIT', 'TypeScript', 'React 18 & 19'];

export function Hero() {
  return (
    <section id="top" className="fc-hero">
      <div className="fc-hero__inner">
        <div>
          <div className="fc-hero__eyebrow">
            <div className="fc-hero__eyebrow-dot" />
            A side project &middot; MIT licensed &middot; early
          </div>
          <h1 className="fc-hero__h1">
            Forms are just code, so I wrote them that way.
          </h1>
          <p className="fc-hero__sub">
            FieldCraft is a schema-driven form engine for React. You describe a
            form once in JSON and it handles validation, conditional logic,
            multi-step navigation, drafts and submission.
          </p>
          <p className="fc-hero__sub">
            I built it to learn how to publish and maintain npm packages. It
            works, I use it, and the source is MIT if it&rsquo;s useful to you.
          </p>
          <div className="fc-hero__actions">
            <a href="/docs" className="fc-hero__cta">Read the docs →</a>
            <CopyInstall />
          </div>
          <div className="fc-hero__badges">
            {badges.map((b) => (
              <div key={b} className="fc-hero__badge">{b}</div>
            ))}
          </div>
        </div>
        <HeroTabs />
      </div>
      <SpecStrip />
    </section>
  );
}
