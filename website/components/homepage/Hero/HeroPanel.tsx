'use client';

import { useState, type ReactNode } from 'react';
import { HeroForm } from './HeroForm';

/*
 * Schema and result, side by side and at the same time.
 *
 * Two tabs became one split panel because you could previously see the
 * schema OR the form but never the relationship between them — and the
 * relationship IS the product. Showing both at once is why the panel
 * takes the full width of the page rather than a column beside the copy.
 *
 * BELOW 1080px the columns stack, and stacked they put a wall of JSON
 * above the form: the first thing a phone visitor met inside the demo was
 * code, with the working form — the part that actually convinces — pushed
 * under it. So at that width the two panes become tabs with the PREVIEW
 * active by default. The schema is still one tap away; it is half the
 * argument and hiding it entirely would weaken the panel.
 *
 * Desktop ignores `tab` completely: both panes render, and the tab bar is
 * inert labelling. The buttons stay buttons there rather than being
 * swapped for spans, so there is one DOM across breakpoints and nothing
 * remounts when the viewport crosses 1080.
 *
 * The right pane is a mockup, labelled as one in HeroForm. The real
 * engine runs in LiveDemos, which imports FormEngineRenderer from the
 * published package.
 *
 * The schema pane arrives as `children` rather than being imported. This
 * component is a client component for the tab state, and a client
 * component cannot import a server one — it would drag SchemaPanel, and
 * with it Shiki, into the browser bundle to highlight a schema that never
 * changes. Passed as children it stays server-rendered, highlighted at
 * build time, costing nothing at runtime.
 */

type Tab = 'preview' | 'schema';

/* Inline rather than lucide-react: the site imports no icon library
   anywhere today, and two 16px glyphs in the hero — which every visitor
   loads — do not justify adding one. */
function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m8 17-5-5 5-5M16 7l5 5-5 5" />
    </svg>
  );
}

function FormIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M7.5 9.5h9M7.5 14h5" />
    </svg>
  );
}

export function HeroPanel({ schema }: { schema: ReactNode }) {
  const [tab, setTab] = useState<Tab>('preview');

  return (
    <div className="fc-hero-panel" data-tab={tab}>
      <header className="fc-hero-panel__chrome">
        {/* Three colours, as window lights actually are. Inert and
            unlabelled — chrome can say "this is an editor" and nothing
            more without making a claim it cannot back. */}
        <span className="fc-hero-panel__lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        {/* Order follows the panes: schema left, preview right. The
            inactive tab drops its label and keeps only its icon, handing
            the width back to the active one — which is where the space
            is needed on a narrow screen. */}
        <div className="fc-hero-panel__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            id="hero-tab-schema"
            aria-selected={tab === 'schema'}
            aria-controls="hero-pane-schema"
            onClick={() => setTab('schema')}
          >
            <CodeIcon />
            <span>event-registration.json</span>
          </button>
          <button
            type="button"
            role="tab"
            id="hero-tab-preview"
            aria-selected={tab === 'preview'}
            aria-controls="hero-pane-preview"
            onClick={() => setTab('preview')}
          >
            <FormIcon />
            <span>Preview</span>
          </button>
        </div>

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
        <div
          className="fc-hero-panel__code"
          id="hero-pane-schema"
          role="tabpanel"
          aria-labelledby="hero-tab-schema"
        >
          {schema}
        </div>
        <div
          className="fc-hero-panel__preview"
          id="hero-pane-preview"
          role="tabpanel"
          aria-labelledby="hero-tab-preview"
        >
          <HeroForm />
        </div>
      </div>
    </div>
  );
}
