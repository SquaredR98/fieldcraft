'use client';

import { useState } from 'react';

/*
 * A mockup, deliberately — hand-written markup whose state is local React,
 * matching the schema in SchemaPanel field for field. It is NOT the engine:
 * the reveal below is a React conditional, and the email error is derived
 * here rather than by the validation runner.
 *
 * The real engine runs in LiveDemos further down the page, which imports
 * FormEngineRenderer from the published package. Kept as a mockup here
 * because the hero must render instantly on the server; labelled as one
 * because Rule 9 does not allow presenting a drawing as the product.
 */

export function RenderedPanel() {
  const [name, setName] = useState('Aanya Sharma');
  // Caught mid-error on purpose: a form showing a validation message is
  // better evidence than a pristine one. Derived below, not drawn.
  const [email, setEmail] = useState('aanya@');
  const [consent, setConsent] = useState(true);
  const [gp, setGp] = useState('');

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="fc-hero-rendered">
      <div>
        <label className="fc-hero-rendered__label" htmlFor="hero-name">
          Full name <span className="fc-hero-rendered__required">*</span>
        </label>
        <input
          id="hero-name"
          type="text"
          className="fc-hero-rendered__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="fc-hero-rendered__label" htmlFor="hero-email">
          Email <span className="fc-hero-rendered__required">*</span>
        </label>
        <input
          id="hero-email"
          type="email"
          className={`fc-hero-rendered__input${
            emailValid ? '' : ' fc-hero-rendered__input--invalid'
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!emailValid}
          aria-describedby={emailValid ? undefined : 'hero-email-error'}
        />
        {!emailValid && (
          <div className="fc-hero-rendered__error" id="hero-email-error">
            Enter a valid email address
          </div>
        )}
      </div>
      <label className="fc-hero-rendered__checkbox">
        <div
          className={`fc-hero-rendered__check ${consent ? 'fc-hero-rendered__check--on' : ''}`}
          role="checkbox"
          aria-checked={consent}
        >
          {consent && '\u2713'}
        </div>
        <input
          type="checkbox"
          className="sr-only"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span className="fc-hero-rendered__check-label">Share records with my GP</span>
      </label>
      {consent && (
        <div className="fc-hero-rendered__conditional">
          {/* Was "Revealed by showIf", which credited the engine for a
              React conditional. It names the schema line it mirrors
              instead. */}
          <div className="fc-hero-rendered__conditional-label">
            showIf: consent eq true
          </div>
          <label className="fc-hero-rendered__label" htmlFor="hero-gp">
            GP practice
          </label>
          <input
            id="hero-gp"
            type="text"
            className="fc-hero-rendered__input"
            value={gp}
            onChange={(e) => setGp(e.target.value)}
            placeholder="Type a practice name…"
          />
        </div>
      )}
      <div className="fc-hero-rendered__buttons">
        <button type="button" className="fc-hero-rendered__btn-outline">Back</button>
        <button type="button" className="fc-hero-rendered__btn-primary">Submit</button>
      </div>
    </div>
  );
}
