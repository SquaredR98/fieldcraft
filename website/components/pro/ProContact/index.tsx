'use client';

import { useState, useCallback } from 'react';
import { FormEngineRenderer } from '@squaredr/fieldcraft-react';
import { useSiteTheme } from '@/lib/use-site-theme';
import type { FormEngineSchema, FormResponse } from '@squaredr/fieldcraft-core';
import '../shared.css';
import './styles.css';

const contactSchema: FormEngineSchema = {
  id: 'pro-contact',
  version: '1',
  title: 'Get in touch',
  submitAction: { type: 'callback' },
  sections: [
    {
      id: 'contact',
      title: 'Contact',
      questions: [
        { id: 'name', type: 'short_text', label: 'Name', required: true },
        { id: 'email', type: 'email', label: 'Email', required: true },
        { id: 'company', type: 'short_text', label: 'Company', required: false },
        {
          id: 'interest',
          type: 'dropdown',
          label: 'Interest',
          required: true,
          options: [
            { label: 'Join the Pro waitlist', value: 'waitlist' },
            { label: 'Licensing question', value: 'licensing' },
            { label: 'Telehealth module', value: 'telehealth' },
            { label: 'Agency / multi-project use', value: 'agency' },
            { label: 'Something else', value: 'other' },
          ],
        },
        { id: 'message', type: 'long_text', label: 'Message', required: true },
      ],
    },
  ],
};

export function ProContact() {
  const theme = useSiteTheme();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(async (response: FormResponse) => {
    try {
      await fetch('/api/pro-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      });
    } catch {
      // Best-effort — enquiry is not critical path.
    }
    setSubmitted(true);
  }, []);

  return (
    <section id="contact" className="fc-pro-contact">
      <div className="fc-pro-contact__inner">
        <div className="fc-pro-contact__grid">
          <div>
            <div className="fc-pro-eyebrow">
              <div className="fc-pro-eyebrow__dot" />
              Get in touch
            </div>
            <h2 className="fc-pro-h2">Questions before launch?</h2>
            <p className="fc-pro-contact__desc">
              Licensing edge cases, roadmap, or whether the Telehealth module
              covers your instrument &mdash; ask. Replies come from the maintainer.
            </p>
            <div className="fc-pro-contact__dogfood">
              <div className="fc-pro-contact__dogfood-label">Dogfood</div>
              <div className="fc-pro-contact__dogfood-text">
                This form is built with FieldCraft &mdash; same engine, same
                renderer, no special case.
              </div>
            </div>
          </div>

          <div className="fc-pro-contact__form-wrapper">
            <div className="fc-pro-contact__chrome">
              <div className="fc-pro-contact__chrome-dot" />
              <span className="fc-pro-contact__chrome-label">
                contact.json &middot; v2
              </span>
            </div>

            {submitted ? (
              <div className="fc-pro-contact__success">
                <div className="fc-pro-contact__success-label">Submitted</div>
                <div className="fc-pro-contact__success-title">
                  Thanks &mdash; that landed.
                </div>
                <p className="fc-pro-contact__success-desc">
                  You are on the waitlist and you&rsquo;ll hear from us before
                  launch.
                </p>
                <button
                  type="button"
                  className="fc-pro-contact__success-reset"
                  onClick={() => setSubmitted(false)}
                >
                  Send another
                </button>
              </div>
            ) : (
              <div className="fc-pro-contact__form-body">
                <FormEngineRenderer
                  schema={contactSchema}
                  onSubmit={handleSubmit}
                  theme={theme}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
