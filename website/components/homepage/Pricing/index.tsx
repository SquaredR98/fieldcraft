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
  'Schema editor with live preview',
  'Theme editor and response viewer',
  'Validation and condition builders',
  'Full undo, redo and shortcuts',
];

export function Pricing() {
  return (
    <section id="pricing" className="fc-pricing">
      <div className="fc-pricing__inner">
        <div className="fc-pricing__eyebrow">10 &middot; Pricing</div>
        <h2 className="fc-pricing__h2">Free forever, or paid once.</h2>
        <p className="fc-pricing__sub">
          The engine and the React renderer are MIT and always free. Pro is a
          one-time purchase with free patch and minor updates inside the major
          version you bought.
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
            <a href="/products/fieldcraft/docs" className="fc-pricing__cta fc-pricing__cta--outline">
              Read the docs &rarr;
            </a>
          </div>

          {/* ── Pro card ── */}
          <div className="fc-pricing__card fc-pricing__card--pro">
            <div className="fc-pricing__pro-header">
              <div className="fc-pricing__card-eyebrow fc-pricing__card-eyebrow--amber">
                Pro &middot; one-time licence
              </div>
              <span className="fc-pricing__badge">Most complete</span>
            </div>
            <h3 className="fc-pricing__card-title">FieldCraft Pro</h3>
            <div className="fc-pricing__price-line">
              <span className="fc-pricing__price">$99</span>
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
            <a href="/products/fieldcraft/docs/pro" className="fc-pricing__cta fc-pricing__cta--primary">
              Learn about Pro &rarr;
            </a>
          </div>
        </div>

        {/* ── Secondary row ── */}
        <div className="fc-pricing__secondary">
          {/* ── Telehealth addon ── */}
          <div className="fc-pricing__addon">
            <div className="fc-pricing__addon-left">
              <div className="fc-pricing__addon-title-row">
                <h4 className="fc-pricing__addon-title">Telehealth</h4>
                <span className="fc-pricing__addon-price">$249 once</span>
              </div>
              <p className="fc-pricing__addon-desc">
                Everything in Pro, plus 15 telehealth field types, HIPAA-ready
                patterns, patient intake templates and clinical assessment
                fields.
              </p>
            </div>
            <div className="fc-pricing__addon-right">
              <a href="mailto:hello@squaredr.tech?subject=FieldCraft%20Telehealth%20interest" className="fc-pricing__addon-link">
                I&rsquo;m interested &rarr;
              </a>
            </div>
          </div>

          {/* ── Admin template addon ── */}
          <div className="fc-pricing__addon">
            <div className="fc-pricing__addon-left">
              <div className="fc-pricing__addon-title-row">
                <h4 className="fc-pricing__addon-title">Admin template</h4>
                <span className="fc-pricing__addon-price">$549 once</span>
              </div>
              <p className="fc-pricing__addon-desc">
                A production Next.js application with Prisma, authentication and
                the builder pre-integrated. Delivered as a private repository.
              </p>
            </div>
            <div className="fc-pricing__addon-right">
              <span className="fc-pricing__addon-badge">Coming soon</span>
            </div>
          </div>
        </div>

        {/* ── Legal footnote ── */}
        <p className="fc-pricing__legal">
          Prices in USD, exclusive of tax; tax may be added at checkout
          depending on your region. One licence key covers one production
          domain, with unlimited development and localhost use. Patch and minor
          updates are free within the major version purchased. No refunds after
          a licence key is activated. The MIT-licensed engine and renderer are
          separate open-source packages and are not part of a Pro purchase.
        </p>
      </div>
    </section>
  );
}
