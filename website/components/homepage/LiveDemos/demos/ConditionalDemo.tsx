'use client';

import { useState, useCallback } from 'react';
import { FormEngineRenderer } from '@squaredr/fieldcraft-react';
import type { FormResponse } from '@squaredr/fieldcraft-core';
import { homepageConditionalSchema } from '@/schemas/homepage-conditional';
import { useSiteTheme } from '@/lib/use-site-theme';

export function ConditionalDemo() {
  const theme = useSiteTheme();
  const [result, setResult] = useState<FormResponse | null>(null);

  const handleSubmit = useCallback(async (response: FormResponse) => {
    setResult(response);
  }, []);

  if (result) {
    return (
      <div className="fc-demos__result">
        <div className="fc-demos__result-label">Submitted</div>
        <pre className="fc-demos__result-json">
          {JSON.stringify(result.values, null, 2)}
        </pre>
        <button className="fc-demos__btn-outline" onClick={() => setResult(null)}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="fc-demos__live-form">
      <FormEngineRenderer
        schema={homepageConditionalSchema}
        theme={theme}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
