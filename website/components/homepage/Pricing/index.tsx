import './styles.css';

const engineBullets = [
  '44 field types',
  'Validation and conditional logic',
  'Multi-step navigation and drafts',
  'Submission adapters',
  'Free template schemas',
];

const proBullets = [
  'Drag-and-drop form builder',
  'Response viewer with export and charts',
  'Theme editor with live preview',
  'Telehealth module with clinical instruments',
  'TypeScript types and full API reference',
];

export function Pricing() {
  return (
    <section id="pricing" className="fc-pricing">
      <div className="fc-pricing__inner">
        <div className="fc-pricing__eyebrow">10 &middot; Pricing</div>
        <h2 className="fc-pricing__h2">Free forever, or paid once.</h2>
        <p className="fc-pricing__sub">
          The engine and the React renderer are MIT and always free. Pro is a
          one-time purchase — FormBuilder, ResponseViewer, ThemeEditor and
          Telehealth, all included.
        </p>

        {/* ── Main cards ── */}
        <div className="fc-pricing__grid">
          {/* ── Engine card ── */}
          <div className="fc-pricing__card fc-pricing__card--engine">
            <div className="fc-pricing__card-eyebrow fc-pricing__card-eyebrow--teal">
              Free &middot; MIT &middot; open source
            </div>
            <h3 className="fc-pricing__card-title">FieldCraft Engine</h3>
            <div className="fc-pricing__price-line">
              <span className="fc-pricing__price">$0</span>
              <span className="fc-pricing__price-note">
                forever, no account
              </span>
            </div>
            <ul className="fc-pricing__bullets">
              {engineBullets.map((item) => (
                <li key={item} className="fc-pricing__bullet">
                  <span className="fc-pricing__bullet-dot">&middot;</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href="/docs" className="fc-pricing__cta fc-pricing__cta--outline">
              Read the docs &rarr;
            </a>
          </div>

          {/* ── Pro card ── */}
          <div className="fc-pricing__card fc-pricing__card--pro">
            <div className="fc-pricing__pro-header">
              <div className="fc-pricing__card-eyebrow fc-pricing__card-eyebrow--amber">
                Pro &middot; one-time licence
              </div>
              <span className="fc-pricing__badge">Everything included</span>
            </div>
            <h3 className="fc-pricing__card-title">FieldCraft Pro</h3>
            <div className="fc-pricing__price-line">
              <span className="fc-pricing__price fc-pricing__price--strike">$399</span>
              <span className="fc-pricing__price">$199</span>
              <span className="fc-pricing__price-note">
                once, per production domain
              </span>
            </div>
            <ul className="fc-pricing__bullets">
              {proBullets.map((item) => (
                <li key={item} className="fc-pricing__bullet">
                  <span className="fc-pricing__bullet-dot">&middot;</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href="/pro" className="fc-pricing__cta fc-pricing__cta--primary">
              See Pro in action &rarr;
            </a>
          </div>
        </div>

        {/* ── Legal footnote ── */}
        <p className="fc-pricing__legal">
          Prices in USD, exclusive of tax. One licence key covers one production
          domain, with unlimited development and localhost use. Twelve months of
          updates included. The MIT-licensed engine and renderer are separate
          open-source packages and are not part of a Pro purchase.
        </p>
      </div>
    </section>
  );
}
