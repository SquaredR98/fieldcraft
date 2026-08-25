import '../shared.css';
import './styles.css';

const includes = [
  'FormBuilder, ResponseViewer and ThemeEditor components',
  'All 44 field types plus the Pro-only advanced set',
  'TypeScript types and full API reference',
  'Twelve months of updates, including new modules',
  'Private issue tracker with maintainer response',
  'Commercial use in client and internal projects',
];

export function ProPricing() {
  return (
    <section id="pricing" className="fc-pro-pricing">
      <div className="fc-pro-pricing__inner">
        <div className="fc-pro-pricing__center">
          <div className="fc-pro-pricing__header">
            <div className="fc-pro-eyebrow fc-pro-eyebrow--amber" style={{ justifyContent: 'center' }}>
              <div className="fc-pro-eyebrow__dot fc-pro-eyebrow__dot--amber" />
              Launch price &mdash; limited time
            </div>
            <h2 className="fc-pro-h2">Buy it once. Ship it everywhere.</h2>
          </div>

          <div className="fc-pro-pricing__card">
            <div className="fc-pro-pricing__grid">
              <div className="fc-pro-pricing__left">
                <div>
                  <div className="fc-pro-pricing__tier-label">
                    FieldCraft Pro &middot; perpetual
                  </div>
                  <div className="fc-pro-pricing__price-row">
                    <span className="fc-pro-pricing__price">$199</span>
                    <span className="fc-pro-pricing__price-old">$399</span>
                  </div>
                  <div className="fc-pro-pricing__price-note">
                    One-time &middot; no subscription
                  </div>
                </div>
                <div className="fc-pro-pricing__cta-area">
                  <a href="#contact" className="fc-pro-pricing__cta">
                    Coming soon &mdash; join the waitlist
                  </a>
                  <p className="fc-pro-pricing__legal">
                    One licence per production domain. Unlimited development and
                    staging use.
                  </p>
                </div>
              </div>

              <div className="fc-pro-pricing__right">
                <div className="fc-pro-pricing__includes-label">
                  What&rsquo;s included
                </div>
                <ul className="fc-pro-pricing__bullets">
                  {includes.map((item) => (
                    <li key={item} className="fc-pro-pricing__bullet">
                      <span className="fc-pro-pricing__bullet-check">&#10003;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
