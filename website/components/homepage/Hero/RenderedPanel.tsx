'use client';

import { useState } from 'react';

export function RenderedPanel() {
  const [name, setName] = useState('Aanya Sharma');
  const [email, setEmail] = useState('aanya@clinic.example');
  const [consent, setConsent] = useState(true);
  const [gp, setGp] = useState('');

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
          className="fc-hero-rendered__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
          <div className="fc-hero-rendered__conditional-label">
            Revealed by showIf
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
            placeholder="Type a practice name\u2026"
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
