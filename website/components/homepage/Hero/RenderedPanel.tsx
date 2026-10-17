'use client';

import { useState } from 'react';

/*
 * The hero's evidence panel.
 *
 * This is a MOCKUP, deliberately — hand-written markup whose state is local
 * React, not a running engine. The real engine runs in LiveDemos further
 * down, which imports FormEngineRenderer from the published package. Kept as
 * a mockup here because the hero must render on the server with no client
 * JS; labelled as one because Rule 9 does not allow presenting a drawing as
 * the product. Every field mirrors the schema in SchemaPanel one-to-one.
 *
 * Its job is to PROVE the sub-headline rather than restate it. The headline
 * claims steps, conditional logic, validation, computed fields and drafts;
 * a pristine three-field form demonstrates none of them. So the form is
 * caught mid-interaction, and each state is doing a specific job:
 *
 *   "Step 1 of 2" + segmented bar   multi-step navigation is real
 *   `ada@` with an amber message    validation actually runs
 *   Workshop selected and lit       selection state is modelled
 *   dashed box naming its own rule  the conditional field says WHY it is
 *                                   visible — the mechanism is visible
 *                                   rather than asserted
 *   "Draft saved · 2s ago"          drafts, the feature nobody believes
 *                                   until they see it
 *
 * Event registration rather than patient intake: a ticket type and dietary
 * needs are legible to anyone in two seconds, where a GP-records consent
 * field reads as a niche vertical.
 */

type Ticket = 'standard' | 'workshop';

export function RenderedPanel() {
  const [name, setName] = useState('Ada Lovelace');
  // Caught mid-error on purpose. A form showing a validation message is
  // better evidence than a pristine one, and the error is DERIVED below
  // rather than drawn, so editing the value clears it.
  const [email, setEmail] = useState('ada@');
  const [ticket, setTicket] = useState<Ticket>('workshop');
  const [diet, setDiet] = useState('');

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="fc-hero-form">
      {/* Step indicator. Two segments, first filled — the claim is
          multi-step, so the shape has to show more than one step exists. */}
      <div className="fc-hero-form__steps">
        <span className="fc-hero-form__seg fc-hero-form__seg--on" />
        <span className="fc-hero-form__seg" />
        <span className="fc-hero-form__steps-label">Step 1 of 2</span>
      </div>

      <h3 className="fc-hero-form__title">Attendee</h3>
      <p className="fc-hero-form__hint">Tell us who&rsquo;s coming.</p>

      <div className="fc-hero-form__fields">
        <div>
          <label className="fc-hero-form__label" htmlFor="hero-name">
            Full name <span className="fc-hero-form__req">*</span>
          </label>
          <input
            id="hero-name"
            type="text"
            className="fc-hero-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="fc-hero-form__label" htmlFor="hero-email">
            Work email <span className="fc-hero-form__req">*</span>
          </label>
          <input
            id="hero-email"
            type="email"
            className={`fc-hero-form__input${
              emailValid ? '' : ' fc-hero-form__input--invalid'
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!emailValid}
            aria-describedby={emailValid ? undefined : 'hero-email-error'}
          />
          {!emailValid && (
            <p className="fc-hero-form__error" id="hero-email-error">
              Enter a valid email address
            </p>
          )}
        </div>

        {/* Radio group, not buttons: it is a single-choice question, and the
            selected option is what reveals the conditional field below. */}
        <fieldset className="fc-hero-form__group">
          <legend className="fc-hero-form__label">Ticket</legend>
          <div className="fc-hero-form__options">
            {(
              [
                ['standard', 'Standard'],
                ['workshop', 'Workshop'],
              ] as const
            ).map(([val, label]) => (
              <label
                key={val}
                className={`fc-hero-form__option${
                  ticket === val ? ' fc-hero-form__option--on' : ''
                }`}
              >
                <input
                  type="radio"
                  name="hero-ticket"
                  className="sr-only"
                  checked={ticket === val}
                  onChange={() => setTicket(val)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* The payoff. A dashed teal border with its label notched into the
            top edge, naming the rule that put it on screen. Saying
            "showIf → ticket = Workshop" is the difference between claiming
            conditional logic and showing it: the reader can see the rule,
            the input it depends on, and the result at the same time. */}
        {ticket === 'workshop' && (
          <div className="fc-hero-form__conditional">
            <span className="fc-hero-form__rule">
              showIf &rarr; ticket = Workshop
            </span>
            <label className="fc-hero-form__label" htmlFor="hero-diet">
              Dietary needs
            </label>
            <input
              id="hero-diet"
              type="text"
              className="fc-hero-form__input"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              placeholder="Vegetarian, no nuts…"
            />
          </div>
        )}
      </div>

      <div className="fc-hero-form__foot">
        {/* Drafts are opt-OUT in the engine (allowDraftSave !== false), so
            this is the default behaviour, not an upsell. */}
        <span className="fc-hero-form__draft">Draft saved &middot; 2s ago</span>
        <button type="button" className="fc-hero-form__continue">
          Continue <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
