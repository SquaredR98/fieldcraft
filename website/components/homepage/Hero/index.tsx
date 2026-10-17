import { CopyInstall } from '@/components/shared/CopyInstall';
import { HeroPanel } from './HeroPanel';
import { SpecStrip } from './SpecStrip';
import './styles.css';

/*
 * The hero answers "what is this" before "why is it different".
 *
 * It used to lead with data sovereignty — "Your forms. Your database.
 * Nobody in the middle." That is the stronger *differentiator*, because a
 * hosted service structurally cannot copy it, but it assumes the reader
 * already knows what kind of thing FieldCraft is. A developer arriving cold
 * from a search or a link needs the category first. Sovereignty now belongs
 * to the SaaS product, where the buyer is choosing between hosts and the
 * argument actually decides a purchase.
 *
 * So: capability in the headline, and the proof immediately under it in the
 * spec strip. The schema panel on the right carries the real weight — it is
 * the product, and seeing it beats being told about it.
 *
 * No Pro CTA here. The primary action used to be "Explore Builder",
 * anchoring to the Pro teaser; the OSS has to stand on its own first.
 */

/* Checked against packages/react/package.json: the runtime deps are
   dompurify and radix-ui, so "zero dependencies" would be false. "No
   backend" is both true and the thing a reader actually wants to know. */
const badges = ['MIT', 'TypeScript', 'React 18 & 19', 'No backend required'];

export type HeroProps = {
  /** Newest shipped version, from lib/changelog.ts via page.tsx (Rule 11). */
  version: string;
};

export function Hero({ version }: HeroProps) {
  return (
    <section id="top" className="fc-hero">
      <div className="fc-v2-grid" aria-hidden="true" />
      <div className="fc-hero__inner">
        <div className="fc-hero__copy">
          {/* Version comes from props, which page.tsx reads out of
              lib/changelog.ts — the same source the Status section uses. A
              version typed into markup here is a figure that goes stale
              silently, which is how the site came to advertise 1.7.0 for
              seven weeks. */}
          <a className="fc-hero__release" href="/changelog">
            <span className="fc-hero__release-pill">{version}</span>
            Now on npm &mdash; read the release notes
            <span className="fc-v2-link__arrow">&rarr;</span>
          </a>
          <h1 className="fc-hero__h1">
            Declare the form.<br />
            FieldCraft renders the rest.
          </h1>
          <div className="fc-hero__tick" />
          <p className="fc-hero__sub">
            A schema-driven form engine for React. Multi-step navigation,
            conditional logic, validation, computed fields and drafts &mdash;
            all from one typed object you can version, diff and review.
          </p>
          {/* Docs leads now that the builder CTA is gone. A developer who
              wants to evaluate this reads the API; the install line below
              is for the one who has already decided. */}
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
      </div>
      {/* Full width, below the copy — the schema/result relationship is the
          argument, so it gets the whole page rather than a column. */}
      <HeroPanel />
      <SpecStrip />
    </section>
  );
}
