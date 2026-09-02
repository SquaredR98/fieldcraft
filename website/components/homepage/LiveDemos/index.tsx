import { LiveDemosTabs } from './LiveDemosTabs';
import './styles.css';

export function LiveDemos() {
  return (
    <section id="demos" className="fc-demos">
      <div className="fc-demos__inner">
        <div className="fc-demos__eyebrow">Demos</div>
        <h2 className="fc-demos__h2">
          Easier to show than to explain.
        </h2>
        <p className="fc-demos__sub">
          Four behaviours the engine handles for you, running here on this
          page: steps, conditional fields, validation and computed values.
        </p>
        <LiveDemosTabs />
      </div>
    </section>
  );
}
