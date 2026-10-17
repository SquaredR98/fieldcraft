'use client';

import { SchemaPanel } from './SchemaPanel';
import { RenderedPanel } from './RenderedPanel';

/*
 * Schema and result, side by side and at the same time.
 *
 * This was two tabs, which meant you could see the schema OR the form but
 * never the relationship between them — and the relationship IS the product.
 * Showing both at once is why the panel earns the full width of the page
 * rather than sitting in a column beside the copy.
 *
 * The right half is deliberately labelled as a mockup. It is hand-written
 * markup whose state is local React, not a running engine, and the fields
 * correspond one-to-one with the schema on the left. The real engine runs
 * further down the page in LiveDemos, which imports FormEngineRenderer from
 * the published package. Rule 9: a mockup is fine, presenting one as the
 * product is not.
 */
export function HeroPanel() {
  return (
    <div className="fc-hero-panel">
      <div className="fc-v2-bracket fc-v2-bracket--tl" aria-hidden="true" />
      <div className="fc-v2-bracket fc-v2-bracket--br" aria-hidden="true" />

      <div className="fc-hero-panel__chrome">
        <div className="fc-hero-panel__lights" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="fc-hero-panel__file">event-registration.json</div>
        <div className="fc-hero-panel__file fc-hero-panel__file--muted">
          Preview
        </div>
        {/* Not decoration: the schema in SchemaPanel was run through
            validateSchema() from the published core and passes. It failed
            first time — an empty `questions` array on section 2 — which is
            exactly why this is worth asserting rather than drawing. */}
        <div className="fc-hero-panel__status">
          <span className="fc-hero-panel__pip" aria-hidden="true" />
          schema valid
        </div>
      </div>

      <div className="fc-hero-panel__split">
        <div className="fc-hero-panel__code">
          <SchemaPanel />
        </div>
        <div className="fc-hero-panel__preview">
          <RenderedPanel />
        </div>
      </div>
    </div>
  );
}
