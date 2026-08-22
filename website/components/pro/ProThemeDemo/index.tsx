'use client';

import { ThemeEditor } from '@squaredr/fieldcraft-pro/theme-editor';
import { FieldCraftProProvider } from '@squaredr/fieldcraft-pro';
import '@squaredr/fieldcraft-pro/styles.css';
import '@squaredr/fieldcraft-pro/theme-editor/styles.css';
import '../shared.css';

const badges = ['Live preview', 'CSS export', 'Palette generator', 'Built-in presets'];

export function ProThemeDemo() {
  return (
    <section className="fc-pro-section">
      <div className="fc-pro-section__inner">
        <div className="fc-pro-demo-header">
          <div style={{ maxWidth: 620 }}>
            <div className="fc-pro-eyebrow">
              <div className="fc-pro-eyebrow__dot" />
              Live demo &middot; ThemeEditor
            </div>
            <h2 className="fc-pro-h2">Make it look like your product</h2>
            <p className="fc-pro-sub">
              Tune tokens against a live preview, then export CSS variables or a
              theme object. Five presets to start from.
            </p>
          </div>
          <div className="fc-pro-demo-header__tag">&lt;ThemeEditor /&gt;</div>
        </div>

        <div className="fc-pro-demo">
          <div className="fc-pro-demo__chrome">
            <div className="fc-pro-demo__dots">
              <div className="fc-pro-demo__dot" />
              <div className="fc-pro-demo__dot fc-pro-demo__dot--muted" />
              <div className="fc-pro-demo__dot fc-pro-demo__dot--muted" />
            </div>
            <span className="fc-pro-demo__chrome-label">
              ThemeEditor &middot; your site theme
            </span>
            <span className="fc-pro-demo__chrome-tag">Interactive</span>
          </div>
          <div className="fc-pro-demo__body">
            <FieldCraftProProvider licenseKey={process.env.NEXT_PUBLIC_FC_PRO_KEY ?? ''}>
              <ThemeEditor
                height="500px"
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
