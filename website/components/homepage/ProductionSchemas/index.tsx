import { SchemaTabs } from './SchemaTabs';
import './styles.css';

export function ProductionSchemas() {
  return (
    <section id="schemas" className="fc-schemas">
      <div className="fc-schemas__inner">
        <div className="fc-schemas__eyebrow">06 &middot; Production schemas</div>
        <h2 className="fc-schemas__h2">
          This is what a real form looks like.
        </h2>
        <SchemaTabs />
      </div>
    </section>
  );
}
