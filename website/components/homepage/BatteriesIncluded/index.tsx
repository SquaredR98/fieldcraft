import './styles.css';

const features = [
  {
    title: 'Draft persistence',
    badge: 'Zero config',
    body: 'Answers are written to local storage as they change and restored on the next visit. A long intake form survives a closed tab, a refresh, or a dead battery.',
  },
  {
    title: 'Four-layer prefill',
    badge: 'URL \u00b7 props \u00b7 schema',
    body: 'Initial values resolve in a fixed order: schema defaults, then URL parameters, then props, then explicit initial values. Campaign links and personalised forms need no extra code.',
  },
  {
    title: 'Schema validation at boot',
    badge: 'Fail fast',
    body: 'Duplicate question ids, conditions pointing at fields that do not exist, and malformed expressions are reported when the form loads \u2014 in development, not in a user\u2019s session.',
  },
  {
    title: 'Safe expressions',
    badge: 'No eval',
    body: 'Calculated fields run through a purpose-built parser supporting arithmetic, comparisons and a fixed function set. A schema is data, never executable code.',
  },
];

export function BatteriesIncluded() {
  return (
    <section id="features" className="fc-batteries">
      <div className="fc-batteries__inner">
        <div className="fc-batteries__eyebrow">
          05 &middot; Batteries included
        </div>
        <h2 className="fc-batteries__h2">
          The parts you would otherwise write twice.
        </h2>
        <div className="fc-batteries__grid">
          {features.map((f) => (
            <div key={f.title} className="fc-batteries__card">
              <div className="fc-batteries__card-header">
                <div className="fc-batteries__card-title">{f.title}</div>
                <div className="fc-batteries__badge">{f.badge}</div>
              </div>
              <div className="fc-batteries__card-body">{f.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
