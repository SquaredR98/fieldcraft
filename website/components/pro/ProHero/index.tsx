import '../shared.css';
import '@/components/homepage/v2.css';
import './styles.css';

export function ProHero() {
  return (
    <section className="fc-pro-hero">
      <div className="fc-v2-grid" aria-hidden="true" />
      <div className="fc-pro-hero__inner">
        {/* No price in the eyebrow while purchasing is not live — the
            pricing section states the figure and its availability
            together, which is the honest place for it. */}
        <div className="fc-pro-hero__eyebrow">
          <div className="fc-pro-hero__eyebrow-dot" />
          FieldCraft Pro &middot; one-time licence
        </div>
        <h1 className="fc-pro-hero__h1">
          Your form admin panel.<br />
          Built in minutes, not months.
        </h1>
        <div className="fc-pro-hero__tick" />
        <p className="fc-pro-hero__sub">
          Three React components — a drag-and-drop form designer, a submission
          viewer, and a theme editor. Drop them into your app, keep your data,
          pay once.
        </p>

        <div className="fc-pro-hero__badges">
          <div className="fc-pro-hero__badge">React 18 &amp; 19</div>
          <div className="fc-pro-hero__badge">41 field types</div>
          <div className="fc-pro-hero__badge">One-time purchase</div>
          <div className="fc-pro-hero__badge fc-pro-hero__badge--amber">
            Free on localhost &mdash; no key needed
          </div>
        </div>

        {/* Shared CTA primitives, so Pro's buttons match the rest of the
            site rather than being a fourth button system. */}
        <div className="fc-pro-hero__actions">
          <a href="#formbuilder" className="fc-v2-cta">
            See it in action{" "}
            <span className="fc-v2-cta__arrow fc-pro-hero__arrow-down">
              &darr;
            </span>
          </a>
          <a href="/docs/pro" className="fc-v2-btn">
            Read the docs
          </a>
        </div>
      </div>
    </section>
  );
}
