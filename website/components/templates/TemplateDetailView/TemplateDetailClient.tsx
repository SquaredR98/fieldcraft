'use client';

import { useState, useCallback, useMemo } from 'react';
import { FormEngineRenderer } from '@squaredr/fieldcraft-react';
import type { FormEngineSchema, FormResponse } from '@squaredr/fieldcraft-core';
import { CodeBlockClient } from '@/components/shared/CodeBlock/CodeBlockClient';
import { SubmissionResult } from '@/components/shared/SubmissionResult';
import { siteTheme } from '@/lib/site-theme';

type DisplayMode = 'stepped' | 'classic' | 'conversational';

const DISPLAY_MODES: { value: DisplayMode; label: string }[] = [
  { value: 'stepped', label: 'Stepped' },
  { value: 'classic', label: 'Classic' },
  { value: 'conversational', label: 'Conversational' },
];

interface TemplateDetailClientProps {
  schema: FormEngineSchema;
  schemaJson: string;
}

export function TemplateDetailClient({ schema, schemaJson }: TemplateDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'schema'>('form');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('stepped');
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormResponse | null>(null);

  const handleSubmit = useCallback(async (response: FormResponse) => {
    console.log('[FieldCraft] Template form submitted:', response);
    setSubmittedData(response);
    setSubmitted(true);
  }, []);

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setSubmittedData(null);
  }, []);

  const handleModeChange = useCallback((mode: DisplayMode) => {
    setDisplayMode(mode);
    setSubmitted(false);
    setSubmittedData(null);
  }, []);

  // Create a schema copy with the selected display mode injected
  const modeSchema = useMemo<FormEngineSchema>(() => ({
    ...schema,
    settings: {
      ...schema.settings,
      displayMode,
    },
  }), [schema, displayMode]);

  return (
    <>
      {/* Tab bar — visible only on mobile via CSS */}
      <div className="fc-tpl-detail__tabs">
        <button
          className={`fc-tpl-detail__tab ${activeTab === 'form' ? 'fc-tpl-detail__tab--active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Form
        </button>
        <button
          className={`fc-tpl-detail__tab ${activeTab === 'schema' ? 'fc-tpl-detail__tab--active' : ''}`}
          onClick={() => setActiveTab('schema')}
        >
          Schema
        </button>
      </div>

      <div className="fc-tpl-detail__panels">
        {/* Schema panel — scrolls within form panel's height */}
        <div className={`fc-tpl-detail__panel fc-tpl-detail__panel--schema ${activeTab !== 'schema' ? 'fc-tpl-detail__panel--hidden' : ''}`}>
          <div className="fc-tpl-detail__panel-label">Schema</div>
          <div className="fc-tpl-detail__schema">
            <CodeBlockClient code={schemaJson} lang="json" />
          </div>
        </div>

        {/* Form panel — drives the container height */}
        <div className={`fc-tpl-detail__panel fc-tpl-detail__panel--form ${activeTab !== 'form' ? 'fc-tpl-detail__panel--hidden' : ''}`}>
          <div className="fc-tpl-detail__panel-label">
            <span>Preview</span>
            {/* Display mode toggle */}
            <span className="fc-tpl-detail__mode-toggle">
              {DISPLAY_MODES.map(({ value, label }) => (
                <button
                  key={value}
                  className={`fc-tpl-detail__mode-btn ${displayMode === value ? 'fc-tpl-detail__mode-btn--active' : ''}`}
                  onClick={() => handleModeChange(value)}
                >
                  {label}
                </button>
              ))}
            </span>
          </div>
          <div className="fc-tpl-detail__form">
            {!submitted ? (
              <FormEngineRenderer
                key={displayMode}
                schema={modeSchema}
                theme={siteTheme}
                onSubmit={handleSubmit}
              />
            ) : submittedData ? (
              <SubmissionResult data={submittedData} onReset={handleReset} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
