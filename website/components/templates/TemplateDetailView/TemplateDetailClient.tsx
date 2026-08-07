'use client';

import { useState, useCallback } from 'react';
import { FormEngineRenderer } from '@squaredr/fieldcraft-react';
import type { FormEngineSchema, FormResponse } from '@squaredr/fieldcraft-core';
import { CodeBlockClient } from '@/components/shared/CodeBlock/CodeBlockClient';
import { SubmissionResult } from '@/components/shared/SubmissionResult';
import { siteTheme } from '@/lib/site-theme';

interface TemplateDetailClientProps {
  schema: FormEngineSchema;
  schemaJson: string;
}

export function TemplateDetailClient({ schema, schemaJson }: TemplateDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'schema'>('form');
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
          <div className="fc-tpl-detail__panel-label">Preview</div>
          <div className="fc-tpl-detail__form">
            {!submitted ? (
              <FormEngineRenderer schema={schema} theme={siteTheme} onSubmit={handleSubmit} />
            ) : submittedData ? (
              <SubmissionResult data={submittedData} onReset={handleReset} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
