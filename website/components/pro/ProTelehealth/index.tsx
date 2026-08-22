import '../shared.css';
import './styles.css';

function ChartIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ marginBottom: 20 }}>
      <rect x="0.5" y="0.5" width="33" height="33" stroke="var(--teal-border)" />
      <path d="M6 22 L12 22 L15 12 L19 26 L22 18 L28 18" stroke="var(--teal)" strokeWidth="1.5" />
    </svg>
  );
}

function BodyIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ marginBottom: 20 }}>
      <rect x="0.5" y="0.5" width="33" height="33" stroke="var(--teal-border)" />
      <circle cx="17" cy="11" r="4.5" stroke="var(--teal)" strokeWidth="1.5" />
      <path d="M17 15.5 L17 27 M11 20 L23 20" stroke="var(--teal)" strokeWidth="1.5" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ marginBottom: 20 }}>
      <rect x="0.5" y="0.5" width="33" height="33" stroke="var(--teal-border)" />
      <path d="M9 8 H21 L25 12 V26 H9 Z" stroke="var(--teal)" strokeWidth="1.5" />
      <path d="M13 17 H21 M13 21 H19" stroke="var(--teal)" strokeWidth="1.5" />
    </svg>
  );
}

export function ProTelehealth() {
  return (
    <section className="fc-pro-section fc-pro-section--surface">
      <div className="fc-pro-section__inner">
        <div className="fc-pro-eyebrow fc-pro-eyebrow--amber">
          <div className="fc-pro-eyebrow__dot fc-pro-eyebrow__dot--amber" />
          Telehealth module
        </div>
        <div className="fc-pro-telehealth__header">
          <h2 className="fc-pro-h2" style={{ maxWidth: 600 }}>
            Validated clinical instruments, already scored
          </h2>
          <div className="fc-pro-telehealth__included">
            Included with every Pro licence
          </div>
        </div>

        <div className="fc-pro-grid-1px fc-pro-grid-1px--3col" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <div>
            <ChartIcon />
            <div className="fc-pro-telehealth__title">Clinical instruments</div>
            <p className="fc-pro-telehealth__desc">
              PHQ-9, GAD-7 and PSS-10 as schemas with scoring, severity bands
              and subscale totals computed by the engine.
            </p>
            <div className="fc-pro-telehealth__tags">
              <span className="fc-pro-telehealth__tag">PHQ-9</span>
              <span className="fc-pro-telehealth__tag">GAD-7</span>
              <span className="fc-pro-telehealth__tag">PSS-10</span>
            </div>
          </div>

          <div>
            <BodyIcon />
            <div className="fc-pro-telehealth__title">Healthcare fields</div>
            <p className="fc-pro-telehealth__desc">
              Pain scales, a body region selector, vitals with unit handling and
              reference ranges — as first-class field types.
            </p>
            <div className="fc-pro-telehealth__tags">
              <span className="fc-pro-telehealth__tag">painScale</span>
              <span className="fc-pro-telehealth__tag">bodyRegion</span>
              <span className="fc-pro-telehealth__tag">vitals</span>
            </div>
          </div>

          <div>
            <DocIcon />
            <div className="fc-pro-telehealth__title">Clinical templates</div>
            <p className="fc-pro-telehealth__desc">
              Intake, screening and follow-up assessment schemas you can copy
              into your repository and edit like any other form.
            </p>
            <div className="fc-pro-telehealth__tags">
              <span className="fc-pro-telehealth__tag">14 schemas</span>
              <span className="fc-pro-telehealth__tag">Editable</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
