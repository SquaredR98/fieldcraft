import { SchemaPanel } from './SchemaPanel';
import { HeroForm } from './HeroForm';

/*
 * Schema and result, side by side and at the same time.
 *
 * This was two tabs, which meant you could see the schema OR the form but
 * never the relationship between them — and the relationship IS the
 * product. Showing both at once is why the panel takes the full width of
 * the page rather than sitting in a column beside the copy.
 *
 * The right half is a mockup, labelled as one in HeroForm. The real engine
 * runs in LiveDemos further down, which imports FormEngineRenderer from the
 * published package.
 */
export function HeroPanel() {
  return (
    <div className="fc-hero-panel">
      <header className="fc-hero-panel__chrome">
        {/* Three colours, as window lights actually are. Inert and
            unlabelled — chrome can say "this is an editor" and nothing
            more without making a claim it cannot back. */}
        <span className="fc-hero-panel__lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        <span className="fc-hero-panel__file">event-registration.json</span>
        <span className="fc-hero-panel__file" data-muted="">
          Preview
        </span>

        {/* Not decoration: the schema in SchemaPanel was run through
            validateSchema() from the published core and passes. It failed
            the first time — an empty `questions` array on section 2 —
            which is exactly why this is worth asserting. */}
        <span className="fc-hero-panel__status">
          <i aria-hidden="true" />
          schema valid
        </span>
      </header>

      <div className="fc-hero-panel__split">
        <div className="fc-hero-panel__code">
          <SchemaPanel />
        </div>
        <div className="fc-hero-panel__preview">
          <HeroForm />
        </div>
      </div>
    </div>
  );
}
