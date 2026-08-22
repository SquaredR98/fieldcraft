'use client';

import { useState, useCallback } from 'react';
import '../shared.css';
import './styles.css';

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
    a: 'We offer a 14-day refund policy. If Pro doesn\u2019t work for your use case, contact us within 14 days of purchase for a full refund. No questions asked.',
  },
  {
    q: 'Do I get access to the source code?',
    a: 'Yes. The Pro package ships as source TypeScript. You can read, debug, and extend the code. The licence permits use in your applications but not redistribution of the Pro source code itself.',
  },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function ProFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = useCallback((i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  }, []);

  return (
    <section className="fc-pro-section">
      <div className="fc-pro-section__inner">
        <div className="fc-pro-eyebrow">
          <div className="fc-pro-eyebrow__dot" />
          FAQ
        </div>
        <h2 className="fc-pro-h2" style={{ marginBottom: 32 }}>Before you ask</h2>

        <div className="fc-pro-faq__container">
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
      </div>
    </section>
  );
}
