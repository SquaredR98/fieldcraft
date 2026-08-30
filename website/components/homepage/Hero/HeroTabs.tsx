'use client';

import { useState } from 'react';
import { SchemaPanel } from './SchemaPanel';
import { RenderedPanel } from './RenderedPanel';

type Tab = 'schema' | 'rendered';

export function HeroTabs() {
  const [tab, setTab] = useState<Tab>('rendered');

  return (
    <div className="fc-hero-card">
      <div className="fc-hero-card__tabs">
        <button
          className={`fc-hero-card__tab ${tab === "rendered" ? "fc-hero-card__tab--active" : ""}`}
          onClick={() => setTab("rendered")}
        >
          rendered
        </button>
        <button
          className={`fc-hero-card__tab ${tab === "schema" ? "fc-hero-card__tab--active" : ""}`}
          onClick={() => setTab("schema")}
        >
          schema.json
        </button>

        <div className="fc-hero-card__live-label">Live</div>
      </div>
      <div key={tab} className="fc-tab-panel-enter">
        {tab === "schema" ? <SchemaPanel /> : <RenderedPanel />}
      </div>
    </div>
  );
}
