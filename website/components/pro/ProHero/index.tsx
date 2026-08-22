import './styles.css';

export function ProHero() {
  return (
    <section className="fc-pro-hero">
      <div className="fc-pro-hero__inner">
        <div className="fc-pro-hero__eyebrow">
          <div className="fc-pro-hero__eyebrow-dot" />
          FieldCraft Pro &middot; $199 once
        </div>
        <h1 className="fc-pro-hero__h1">
          Your form admin panel.<br />
          Built in minutes, not months.
        </h1>
        <p className="fc-pro-hero__sub">
          Four React components — a drag-and-drop form designer, a submission
          viewer, a theme editor and a clinical instrument set. Drop them into
          your app, keep your data, pay once.
        </p>

        <div className="fc-pro-hero__badges">
          <div className="fc-pro-hero__badge">React 18 &amp; 19</div>
          <div className="fc-pro-hero__badge">44 field types</div>
          <div className="fc-pro-hero__badge">One-time purchase</div>
          <div className="fc-pro-hero__badge fc-pro-hero__badge--amber">Includes Telehealth</div>
        </div>

        <div className="fc-pro-hero__actions">
          <a href="#formbuilder" className="fc-pro-hero__cta">
            See it in action &darr;
          </a>
          <a href="/docs/pro" className="fc-pro-hero__cta fc-pro-hero__cta--outline">
            Read the docs
          </a>
        </div>
      </div>
    </section>
  );
}
