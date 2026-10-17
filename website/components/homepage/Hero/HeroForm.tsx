'use client';

import { useState } from 'react';

/*
 * The hero's evidence panel — a working two-step form.
 *
 * A MOCKUP, deliberately: hand-written markup whose state is local React,
 * not a running engine. The real engine runs in LiveDemos further down,
 * which imports FormEngineRenderer from the published package. Kept as a
 * mockup here because the hero must render on the server with no hydration
 * pop, and because a mockup cannot dead-end; labelled as one because Rule 9
 * does not allow presenting a drawing as the product. Every field mirrors
 * the schema in SchemaPanel one-to-one.
 *
 * It has to WORK, though — a visitor who types in it, advances and submits
 * should never hit something broken. So:
 *
 *   - the email error is derived from the value, so editing clears it
 *   - "Continue" is blocked while the step is invalid, with the reason
 *     shown rather than the button silently doing nothing
 *   - step 2 is real, and so is submit, which ends in a confirmation
 *   - "Start over" returns to step 1 — no state you cannot get out of
 *
 * Its second job is to prove the sub-headline rather than restate it:
 *
 *   step bar + "Step 1 of 2"      multi-step navigation
 *   `ada@` with a message         validation runs
 *   Workshop selected             selection state
 *   a field naming its own rule   conditional logic, mechanism visible
 *   "Draft saved"                 drafts (opt-OUT in the engine, so this
 *                                 is default behaviour, not an upsell)
 */

type Ticket = 'standard' | 'workshop';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function HeroForm() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [name, setName] = useState('Ada Lovelace');
  // Starts mid-error on purpose: a form showing a validation message is
  // better evidence than a pristine one. Derived, so typing fixes it.
  const [email, setEmail] = useState('ada@');
  const [ticket, setTicket] = useState<Ticket>('workshop');
  const [diet, setDiet] = useState('');
  const [card, setCard] = useState('');
  const [tried, setTried] = useState(false);

  const emailOk = EMAIL.test(email);
  const nameOk = name.trim().length > 0;
  const step1Ok = emailOk && nameOk;
  const cardOk = card.replace(/\s/g, '').length >= 12;

  function reset() {
    setStep(1);
    setDone(false);
    setTried(false);
    setName('Ada Lovelace');
    setEmail('ada@');
    setTicket('workshop');
    setDiet('');
    setCard('');
  }

  if (done) {
    return (
      <div className="fc-hero-form" data-reveal="">
        <p className="fc-hero-form__done">
          <i aria-hidden="true" />
          Registered
        </p>
        <p>
          {name} &middot; {email}
          <br />
          {ticket === 'workshop' ? 'Workshop pass' : 'Standard ticket'}
          {diet ? ` · ${diet}` : ''}
        </p>
        <footer>
          <button type="button" onClick={reset} data-ghost="">
            Start over
          </button>
        </footer>
      </div>
    );
  }

  return (
    <form
      className="fc-hero-form"
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (step === 1) {
          if (step1Ok) {
            setStep(2);
            setTried(false);
          }
          return;
        }
        if (cardOk) setDone(true);
      }}
    >
      <div className="fc-hero-form__steps">
        <span data-on="" />
        <span data-on={step === 2 ? '' : undefined} />
        <small>Step {step} of 2</small>
      </div>

      {step === 1 ? (
        <div data-reveal="">
          <h3>Attendee</h3>
          <p>Tell us who&rsquo;s coming.</p>

          <div className="fc-hero-form__fields">
            <label>
              Full name <b>*</b>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={tried && !nameOk}
              />
            </label>

            <label>
              Work email <b>*</b>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!emailOk}
                aria-describedby="hero-email-err"
              />
              {!emailOk && (
                <small id="hero-email-err" data-error="">
                  Enter a valid email address
                </small>
              )}
            </label>

            <fieldset>
              <legend>Ticket</legend>
              <div className="fc-hero-form__options">
                {(
                  [
                    ['standard', 'Standard'],
                    ['workshop', 'Workshop'],
                  ] as const
                ).map(([val, label]) => (
                  <label key={val} data-on={ticket === val ? '' : undefined}>
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

            {/* The payoff: a dashed field whose label names the rule that
                put it on screen. Saying the rule out loud is the difference
                between claiming conditional logic and showing it — the
                reader sees rule, cause and result at once. */}
            {ticket === 'workshop' && (
              <label className="fc-hero-form__conditional" data-reveal="">
                <code>showIf &rarr; ticket = Workshop</code>
                Dietary needs
                <input
                  type="text"
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  placeholder="Vegetarian, no nuts…"
                />
              </label>
            )}
          </div>
        </div>
      ) : (
        <div data-reveal="">
          <h3>Payment</h3>
          <p>No card is charged — this is a demo.</p>

          <div className="fc-hero-form__fields">
            <label>
              Card number <b>*</b>
              <input
                type="text"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                placeholder="4242 4242 4242 4242"
                aria-invalid={tried && !cardOk}
                aria-describedby="hero-card-err"
              />
              {tried && !cardOk && (
                <small id="hero-card-err" data-error="">
                  Enter a card number to continue
                </small>
              )}
            </label>
          </div>
        </div>
      )}

      <footer>
        {step === 2 ? (
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setTried(false);
            }}
            data-ghost=""
          >
            Back
          </button>
        ) : (
          <small>Draft saved &middot; 2s ago</small>
        )}
        <button type="submit">
          {step === 1 ? 'Continue' : 'Register'}{' '}
          <span aria-hidden="true">&rarr;</span>
        </button>
      </footer>
    </form>
  );
}
