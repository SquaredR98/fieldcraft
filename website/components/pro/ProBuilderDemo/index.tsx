'use client';

import { FormBuilder, DEFAULT_SCHEMA } from '@squaredr/fieldcraft-pro/form-builder';
import { FieldCraftProProvider } from '@squaredr/fieldcraft-pro';
import '@squaredr/fieldcraft-pro/styles.css';
import '../shared.css';

const badges = [
  'Drag & drop',
  'Conditional logic',
  'Validation rules',
  'Undo / redo',
  'JSON export',
  'Keyboard shortcuts',
];

export function ProBuilderDemo() {
  return (
    <section id="formbuilder" className="fc-pro-section">
      <div className="fc-pro-section__inner">
        <div className="fc-pro-demo-header">
          <div style={{ maxWidth: 620 }}>
            <div className="fc-pro-eyebrow">
              <div className="fc-pro-eyebrow__dot" />
              Live demo &middot; FormBuilder
            </div>
            <h2 className="fc-pro-h2">Design the form, get the schema</h2>
            <p className="fc-pro-sub">
              Drag fields in, set conditions and validation, and export the same
              JSON your renderer already reads. This is the real component — try it.
            </p>
          </div>
          <div className="fc-pro-demo-header__tag">&lt;FormBuilder /&gt;</div>
        </div>

        <div className="fc-pro-demo">
          <div className="fc-pro-demo__chrome">
            <div className="fc-pro-demo__dots">
              <div className="fc-pro-demo__dot" />
              <div className="fc-pro-demo__dot fc-pro-demo__dot--muted" />
              <div className="fc-pro-demo__dot fc-pro-demo__dot--muted" />
            </div>
            <span className="fc-pro-demo__chrome-label">
              FormBuilder &middot; patient-intake.json &middot; draft
            </span>
            <span className="fc-pro-demo__chrome-tag">Interactive</span>
          </div>
          <div className="fc-pro-demo__body">
            <FieldCraftProProvider licenseKey={process.env.NEXT_PUBLIC_FC_PRO_KEY ?? ''}>
              <FormBuilder
                initialSchema={DEFAULT_SCHEMA}
                height="700px"
              />
            </FieldCraftProProvider>
          </div>
        </div>

        <div className="fc-pro-badges">
          {badges.map((b) => (
            <div key={b} className="fc-pro-badge">{b}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
