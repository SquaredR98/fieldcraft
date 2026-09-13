import { FormBuilderTeaserClient } from './FormBuilderTeaserClient';
import './styles.css';

export function FormBuilderTeaser() {
  return (
    <section id="builder" className="fc-builder-teaser fc-ground-surface2">
      <div className="fc-builder-teaser__inner">
        <div className="fc-builder-teaser__header">
          <div className="fc-builder-teaser__eyebrow">
            Form Builder
          </div>
          <h2 className="fc-builder-teaser__h2">
            Visual form builder. Drag, drop, done.
          </h2>
          <p className="fc-builder-teaser__sub">
            Build forms visually with the FieldCraft Pro builder. Drag fields
            from the palette, configure properties, and export a clean JSON
            schema — ready to render anywhere.
          </p>
          <a href="/pro" className="fc-v2-link fc-builder-teaser__cta">
            See all Pro components{' '}
            <span className="fc-v2-link__arrow">&rarr;</span>
          </a>
          <p className="fc-builder-teaser__note">
            $199 one-time &middot; includes FormBuilder, ResponseViewer &amp; ThemeEditor.
          </p>
        </div>
        <div className="fc-builder-teaser__form">
          <div className="fc-v2-bracket fc-v2-bracket--tl" aria-hidden="true" />
          <div className="fc-v2-bracket fc-v2-bracket--br" aria-hidden="true" />
          <FormBuilderTeaserClient />
        </div>
      </div>
    </section>
  );
}
