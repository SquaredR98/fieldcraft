import { FormBuilderTeaserClient } from './FormBuilderTeaserClient';
import './styles.css';

export function FormBuilderTeaser() {
  return (
    <section id="builder" className="fc-builder-teaser">
      <div className="fc-builder-teaser__inner">
        <div className="fc-builder-teaser__header">
          <div className="fc-builder-teaser__eyebrow">
            10 &middot; Form Builder
          </div>
          <h2 className="fc-builder-teaser__h2">
            Visual form builder. Drag, drop, done.
          </h2>
          <p className="fc-builder-teaser__sub">
            Build forms visually with the FieldCraft Pro builder. Drag fields
            from the palette, configure properties, and export a clean JSON
            schema — ready to render anywhere.
          </p>
          <a
            href="https://www.npmjs.com/package/@squaredr/fieldcraft-pro"
            className="fc-builder-teaser__cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try it locally on npm &rarr;
          </a>
          <p className="fc-builder-teaser__note">
            Purchase options available soon.
          </p>
        </div>
        <div className="fc-builder-teaser__form">
          <FormBuilderTeaserClient />
        </div>
      </div>
    </section>
  );
}
