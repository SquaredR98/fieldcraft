import { CopyInstall } from '@/components/shared/CopyInstall';
import { HeroPanel } from './HeroPanel';
import { SchemaPanel } from './SchemaPanel';
import { SpecStrip } from './SpecStrip';
import './styles.css';
import Link from 'next/link';

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

export type HeroProps = {
  /** Newest shipped version, from lib/changelog.ts via page.tsx (Rule 11). */
  version: string;
};

export function Hero({ version }: HeroProps) {
  return (
    <section id="top" className="fc-hero">
      {/* The shared 32px line grid — the handoff's DEFAULT pattern. A
          previous pass swapped it for a 20px dot field, but the dots live
          only inside the handoff's `data-dir="b"` variant block; the hero
          itself is on the line grid. Reading a variant as the spec was the
          mistake.

          Glows sit over it: one hue (the CTA's own teal) at three
          strengths, offset rather than centred, since three centred washes
          read as a single vignette. */}
      <div className="fc-v2-grid fc-v2-grid--center" aria-hidden="true" />
      <div className="fc-hero__glows" aria-hidden="true">
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

        {/* The second line is emphasised — it is the one naming the
            product. The span needs no class: `.fc-hero__copy h1 span` is
            exact, and there is only ever one. A previous pass removed the
            emphasis entirely to satisfy Rule 6 after I had built it from
            invented hex values; the fix was to use the real teal tokens,
            not to delete the design decision. */}
        <h1>
          Declare the form.
          <br />
          <span>FieldCraft renders the rest.</span>
        </h1>

        <p>
          A schema-driven form engine for React. Multi-step navigation,
          conditional logic, validation, computed fields and drafts &mdash;
          all from one typed object you can version, diff and review.
        </p>

        <div className="fc-hero__actions">
          <Link href="/docs" className="fc-v2-cta">
            Read the docs <span className="fc-v2-cta__arrow">&rarr;</span>
          </Link>
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

      </div>

      <SpecStrip />

      {/* Full width and last — the schema/result relationship is the
          argument, so it closes the hero and gets the whole page rather
          than a column. */}
      <HeroPanel schema={<SchemaPanel />} />
    </section>
  );
}
