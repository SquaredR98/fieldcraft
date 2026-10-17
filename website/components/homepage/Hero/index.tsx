import { CopyInstall } from '@/components/shared/CopyInstall';
import { HeroPanel } from './HeroPanel';
import { SpecStrip } from './SpecStrip';
import './styles.css';

/*
 * The hero answers "what is this" before "why is it different".
 *
 * Data sovereignty is the stronger differentiator — a hosted service
 * structurally cannot copy it — but it assumes the reader already knows the
 * category. That argument belongs to the SaaS product, where the buyer is
 * comparing hosts and it decides a purchase. Capability leads here.
 *
 * No Pro CTA: the primary action was once "Explore Builder", anchoring to
 * the builder teaser. The OSS has to stand on its own first.
 *
 * STRUCTURE — deliberately few classes. Everything inside `.fc-hero__copy`
 * is styled by element (h1, p, a) rather than given a name of its own,
 * because there is exactly one of each and a class for a singleton is a
 * name with no job. Classes are reserved for layout containers, repeated
 * items, and state.
 */

const badges = ['MIT', 'TypeScript', 'React 18 & 19', 'No backend required'];

export type HeroProps = {
  /** Newest shipped version, from lib/changelog.ts via page.tsx (Rule 11). */
  version: string;
};

export function Hero({ version }: HeroProps) {
  return (
    <section id="top" className="fc-hero">
      {/* One hue, three strengths, offset rather than centred — three
          centred washes would read as a single vignette. */}
      <div className="fc-hero__backdrop" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <div className="fc-hero__copy">
        {/* Version comes from props, which page.tsx reads out of
            lib/changelog.ts — the same source the Status section uses. A
            version typed into markup is a figure that goes stale silently,
            which is how the site advertised 1.7.0 for seven weeks. */}
        <a className="fc-hero__release" href="/changelog">
          <strong>{version}</strong>
          Now on npm &mdash; read the release notes
          <span className="fc-v2-link__arrow">&rarr;</span>
        </a>

        <h1>
          Declare the form.
          <br />
          FieldCraft renders the rest.
        </h1>

        <p>
          A schema-driven form engine for React. Multi-step navigation,
          conditional logic, validation, computed fields and drafts &mdash;
          all from one typed object you can version, diff and review.
        </p>

        <div className="fc-hero__actions">
          <a href="/docs" className="fc-v2-cta">
            Read the docs <span className="fc-v2-cta__arrow">&rarr;</span>
          </a>
          <a
            href="https://github.com/SquaredR98/fieldcraft"
            className="fc-v2-btn"
          >
            View on GitHub
          </a>
        </div>

        {/* Own row: a command to copy, not a second CTA competing for the
            same click. */}
        <div className="fc-hero__install">
          <CopyInstall />
        </div>

        <ul className="fc-hero__badges">
          {badges.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      {/* Full width, below the copy — the schema/result relationship is the
          argument, so it gets the whole page rather than a column. */}
      <HeroPanel />
      <SpecStrip />
    </section>
  );
}
