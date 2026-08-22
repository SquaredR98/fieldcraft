'use client';

import { useState, useCallback } from 'react';
import { FormEngineRenderer } from '@squaredr/fieldcraft-react';
import { useSiteTheme } from '@/lib/use-site-theme';
import type { FormEngineSchema, FormResponse } from '@squaredr/fieldcraft-core';
import '../shared.css';
import './styles.css';

/* ── FAQ data ── */

const faqs = [
  {
    q: 'What\u2019s included in a Pro licence?',
    a: 'Everything: FormBuilder (drag-drop designer), ResponseViewer (table/card/detail/timeline views with export), ThemeEditor (visual customiser with live preview), and the full Telehealth module (clinical instruments, healthcare fields, templates). Plus twelve months of updates.',
  },
  {
    q: 'Is Telehealth a separate purchase?',
    a: 'No. Telehealth is bundled into every Pro licence at no extra cost. Clinical instruments (PHQ-9, GAD-7, etc.), healthcare field components, and clinical templates are all included in the $199 price.',
  },
  {
    q: 'Can I use one licence for multiple projects?',
    a: 'Each licence key is valid for one production domain. You can use it on unlimited localhost and staging environments during development. Need multiple production domains? Contact us for volume pricing.',
  },
  {
    q: 'Does Pro require the OSS FieldCraft engine?',
    a: 'Yes. Pro components are built on top of @squaredr/fieldcraft-core and @squaredr/fieldcraft-react (both MIT-licensed and free). Install the OSS packages first, then add @squaredr/fieldcraft-pro.',
  },
  {
    q: 'What\u2019s the refund policy?',
    a: 'All sales are final. FieldCraft Pro is designed so you can fully evaluate every component on localhost with no time limit before purchasing. The purchase price is for a production licence key only \u2014 not for the software itself, which you already have.',
  },
  {
    q: 'Do I get access to the source code?',
    a: 'Yes. The Pro package ships as source TypeScript. You can read, debug, and extend the code. The licence permits use in your applications but not redistribution of the Pro source code itself.',
  },
];

/* ── Key terms ── */

const keyTerms = [
  {
    label: 'Non-refundable',
    desc: 'All sales final \u2014 evaluate free on localhost first.',
    href: '/legal/terms#refund-policy',
  },
  {
    label: 'One domain per licence',
    desc: 'One production domain per key. Subdomains included.',
    href: '/legal/terms#production-domain',
  },
  {
    label: 'Try before you buy',
    desc: 'Full Pro on localhost, no time limit, no key needed.',
    href: '/legal/terms#free-evaluation',
  },
  {
    label: 'No PII stored',
    desc: 'Licence key is your credential. No email or password.',
    href: '/legal/privacy',
  },
];

/* ── Contact schema ── */

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

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function ProContactFaq() {
  const theme = useSiteTheme();
  const [submitted, setSubmitted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const toggle = useCallback((i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  }, []);

  return (
    <section id="contact" className="fc-pro-contactfaq">
      <div className="fc-pro-contactfaq__inner">
        <div className="fc-pro-contactfaq__grid">
          {/* ── Left column: heading + FAQ + key terms ── */}
          <div className="fc-pro-contactfaq__left">
            <div className="fc-pro-eyebrow">
              <div className="fc-pro-eyebrow__dot" />
              FAQ &amp; Contact
            </div>
            <h2 className="fc-pro-h2">Before you ask</h2>
            <p className="fc-pro-contactfaq__desc">
              Licensing edge cases, roadmap, or whether the Telehealth module
              covers your instrument &mdash; ask. Replies come from the
              maintainer.
            </p>

            {/* FAQ accordion */}
            <div className="fc-pro-contactfaq__faq">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={faq.q}
                    className={`fc-pro-faq__item${isOpen ? ' fc-pro-faq__item--open' : ''}`}
                  >
                    <button
                      type="button"
                      className="fc-pro-faq__trigger"
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                    >
                      <span className="fc-pro-faq__num">{pad(i + 1)}</span>
                      <span className="fc-pro-faq__question">{faq.q}</span>
                      <span className="fc-pro-faq__icon">+</span>
                    </button>
                    {isOpen && (
                      <div className="fc-pro-faq__answer">{faq.a}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Key terms */}
            <div className="fc-pro-contactfaq__terms">
              <div className="fc-pro-contactfaq__terms-label">Key terms</div>
              <div className="fc-pro-contactfaq__terms-list">
                {keyTerms.map((term) => (
                  <a
                    key={term.label}
                    href={term.href}
                    className="fc-pro-contactfaq__term"
                  >
                    <span className="fc-pro-contactfaq__term-label">
                      {term.label}
                    </span>
                    <span className="fc-pro-contactfaq__term-desc">
                      {term.desc}
                    </span>
                    <span className="fc-pro-contactfaq__term-link">
                      Read full terms &rarr;
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Dogfood note */}
            <div className="fc-pro-contactfaq__dogfood">
              <div className="fc-pro-contactfaq__dogfood-label">Dogfood</div>
              <div className="fc-pro-contactfaq__dogfood-text">
                This form is built with FieldCraft &mdash; same engine, same
                renderer, no special case.
              </div>
            </div>
          </div>

          {/* ── Right column: contact form ── */}
          <div className="fc-pro-contactfaq__right">
            <div className="fc-pro-contactfaq__form-wrapper">
              <div className="fc-pro-contactfaq__chrome">
                <div className="fc-pro-contactfaq__chrome-dot" />
                <span className="fc-pro-contactfaq__chrome-label">
                  contact.json &middot; v2
                </span>
              </div>

              {submitted ? (
                <div className="fc-pro-contactfaq__success">
                  <div className="fc-pro-contactfaq__success-label">
                    Submitted
                  </div>
                  <div className="fc-pro-contactfaq__success-title">
                    Thanks &mdash; that landed.
                  </div>
                  <p className="fc-pro-contactfaq__success-desc">
                    You are on the waitlist and you&rsquo;ll hear from us before
                    launch.
                  </p>
                  <button
                    type="button"
                    className="fc-pro-contactfaq__success-reset"
                    onClick={() => setSubmitted(false)}
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <div className="fc-pro-contactfaq__form-body">
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
      </div>
    </section>
  );
}
