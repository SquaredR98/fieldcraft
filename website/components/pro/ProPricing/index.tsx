import '../shared.css';
import '@/components/homepage/v2.css';
import './styles.css';

const includes = [
  'FormBuilder, ResponseViewer and ThemeEditor components',
  'All 41 field types plus the Pro-only advanced set',
  'TypeScript types and full API reference',
  'Twelve months of updates, including new modules',
  'Private issue tracker with maintainer response',
  'Commercial use in client and internal projects',
];

export function ProPricing() {
  return (
    <section id="pricing" className="fc-pro-pricing fc-pro-section fc-pro-section--surface2">
      <div className="fc-pro-pricing__inner">
        <div className="fc-pro-pricing__center">
          {/* No "limited time" urgency while nothing can be bought — an
              expiring discount on an unavailable product is exactly the
              kind of claim Rule 9 exists to prevent. */}
          <div className="fc-pro-pricing__header">
            <div className="fc-pro-eyebrow fc-pro-eyebrow--center">
              <div className="fc-pro-eyebrow__dot" />
              Planned pricing
            </div>
            <h2 className="fc-pro-h2">Pay once. Ship it everywhere.</h2>
          </div>

          <div className="fc-pro-pricing__card">
            <div className="fc-v2-bracket fc-v2-bracket--tl" aria-hidden="true" />
            <div className="fc-v2-bracket fc-v2-bracket--br" aria-hidden="true" />
            <div className="fc-pro-pricing__grid">
              <div className="fc-pro-pricing__left">
                <div>
                  <div className="fc-pro-pricing__tier-label">
                    FieldCraft Pro &middot; perpetual
                  </div>
                  <div className="fc-pro-pricing__price-row">
                    <span className="fc-pro-pricing__price">$199</span>
                  </div>
                  <div className="fc-pro-pricing__price-note">
                    One-time &middot; no subscription &middot; not yet on sale
                  </div>
                </div>
                <div className="fc-pro-pricing__cta-area">
                  {/* Not a link while purchasing is not live — a CTA that
                      looks buyable but is not would fail Rule 9. The free
                      localhost path below is the real action right now. */}
                  <div
                    className="fc-pro-pricing__cta fc-pro-pricing__cta--soon"
                    role="status"
                  >
                    Coming soon
                  </div>
                  <div className="fc-pro-pricing__trial">
                    <span className="fc-pro-pricing__trial-label">
                      Or try it free first
                    </span>
                    <span className="fc-pro-pricing__trial-detail">
                      Install <code>@squaredr/fieldcraft-pro</code> and use
                      every component on localhost &mdash; no time limit, no
                      licence key needed.
                    </span>
                  </div>
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
