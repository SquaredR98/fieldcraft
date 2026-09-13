import { LiveDemosTabs } from './LiveDemosTabs';
import './styles.css';

/*
 * The only section where a visitor operates the real product — these are
 * actual FormEngineRenderer instances with real schemas, not mockups.
 *
 * Everything added here exists to make that legible: a readout naming
 * the running build, a live pip, an interaction hint, and the lead-plate
 * treatment reserved elsewhere for the panel carrying the argument.
 *
 * Figures counted from source per Rule 1 — see SpecStrip for provenance.
 */

const readout = [
  { k: 'engine', v: 'fieldcraft-react', teal: true },
  { k: 'fields', v: '41' },
  { k: 'operators', v: '25' },
];

export function LiveDemos() {
  return (
    <section id="demos" className="fc-demos fc-ground-bg">
      <div className="fc-v2-grid fc-v2-grid--center" aria-hidden="true" />
      <div className="fc-demos__inner">
        <div className="fc-demos__head">
          <div>
            <div className="fc-demos__eyebrow">Demos</div>
            <h2 className="fc-demos__h2">Easier to show than to explain.</h2>
            <p className="fc-demos__sub">
              Four behaviours the engine handles for you, running here on this
              page &mdash; not screenshots. Fill them in, get them wrong, submit
              them.
            </p>
          </div>
          <div className="fc-demos__readout">
            {readout.map((r) => (
              <div key={r.k} className="fc-demos__readout-row">
                <span className="fc-demos__readout-k">{r.k}</span>
                <span
                  className={`fc-demos__readout-v${
                    r.teal ? ' fc-demos__readout-v--teal' : ''
                  }`}
                >
                  {r.v}
                </span>
              </div>
            ))}
          </div>
        </div>
        <LiveDemosTabs />
      </div>
    </section>
  );
}
