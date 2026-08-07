'use client';

import { useState, useCallback } from 'react';
import { FormEngineRenderer } from '@squaredr/fieldcraft-react';
import type { FormResponse } from '@squaredr/fieldcraft-core';
import { homepageValidationSchema } from '@/schemas/homepage-validation';
import { useSiteTheme } from '@/lib/use-site-theme';

export function ValidationDemo() {
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
        schema={homepageValidationSchema}
        theme={theme}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
