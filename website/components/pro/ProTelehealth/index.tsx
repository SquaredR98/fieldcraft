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
    <section className="fc-pro-section fc-pro-section--surface2">
      <div className="fc-pro-section__inner">
        <div className="fc-pro-eyebrow fc-pro-eyebrow--amber">
          <div className="fc-pro-eyebrow__dot fc-pro-eyebrow__dot--amber" />
          Telehealth module
        </div>
        <div className="fc-pro-telehealth__header">
          <h2 className="fc-pro-h2" style={{ maxWidth: 600 }}>
            Validated clinical instruments, already scored
          </h2>
          {/* NOT included with Pro — it is a separate $99 add-on with its
              own FCTH-* licence key that also requires a Pro key. The
              previous copy said "Included with every Pro licence", which
              was false. Not yet published: blocked on instrument
              licensing (see fieldcraft-pro/.plan/roadmap.md Track 1B). */}
          <div className="fc-pro-telehealth__included">
            Separate add-on &middot; coming soon
          </div>
        </div>

        <div className="fc-pro-grid-1px fc-pro-grid-1px--3col" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <div>
            <ChartIcon />
            <div className="fc-pro-telehealth__title">
              11 clinical instruments
            </div>
            <p className="fc-pro-telehealth__desc">
              Each one a schema with scoring, severity bands and subscale
              totals computed by the engine rather than by your code.
            </p>
            <div className="fc-pro-telehealth__tags">
              <span className="fc-pro-telehealth__tag">PHQ-9</span>
              <span className="fc-pro-telehealth__tag">GAD-7</span>
              <span className="fc-pro-telehealth__tag">PCL-5</span>
            </div>
          </div>

          <div>
            <BodyIcon />
            <div className="fc-pro-telehealth__title">
              8 clinical field types
            </div>
            <p className="fc-pro-telehealth__desc">
              Pain scale, body diagram, vitals with unit handling, BMI,
              medication and allergy lists &mdash; as first-class field
              types, not custom components you maintain.
            </p>
            <div className="fc-pro-telehealth__tags">
              <span className="fc-pro-telehealth__tag">pain_scale</span>
              <span className="fc-pro-telehealth__tag">body_diagram</span>
              <span className="fc-pro-telehealth__tag">vitals_entry</span>
            </div>
          </div>

          <div>
            <DocIcon />
            <div className="fc-pro-telehealth__title">
              7 clinical templates
            </div>
            <p className="fc-pro-telehealth__desc">
              Intake, screening and follow-up assessment schemas you copy
              into your repository and edit like any other form.
            </p>
            <div className="fc-pro-telehealth__tags">
              <span className="fc-pro-telehealth__tag">7 schemas</span>
              <span className="fc-pro-telehealth__tag">Editable</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
