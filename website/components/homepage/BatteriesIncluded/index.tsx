import './styles.css';


type Feature = {
  n: string;
  title: string;
  badge: string;
  /** The line that turns the behaviour on, or the API that provides it. */
  code: { k: string; v?: string }[];
};

const features: Feature[] = [
  {
    n: '01',
    title: 'Drafts that survive a closed tab',
    badge: 'On unless disabled',
    code: [
      { k: 'settings.allowDraftSave', v: 'true' },
      // An ENGINE OPTION, not a schema setting — createFormEngine reads
      // options.autoSaveIntervalMs (create-engine.ts:547). It was listed
      // bare beside settings.allowDraftSave, which read as a sibling
      // schema key and would not have worked if copied.
      { k: 'options.autoSaveIntervalMs', v: '2000' },
    ],
  },
  {
    n: '02',
    title: 'Prefill from the URL',
    badge: 'Fixed precedence',
    code: [
      { k: 'question.config.defaultValue' },
      // PrefillConfig takes `source`, one of "props" | "url" | "both"
      // (settings.ts:79). `{ fromUrl: true }` was shown here and that
      // property does not exist.
      { k: 'settings.prefill.source', v: '"both"' },
    ],
  },
  {
    n: '03',
    title: 'Broken schemas fail at boot',
    badge: 'Before first render',
    code: [
      { k: 'validateSchema(schema)' },
      { k: 'throws', v: 'FormEngineSchemaError' },
    ],
  },
  {
    n: '04',
    title: 'Expressions, never eval',
    badge: 'Own parser',
    code: [
      { k: 'expression', v: '"{qty} * {price}"' },
      // Verified against the parser's own switch: floor, ceil, round,
      // abs, min, max. "if" was listed and is not one of them.
      { k: 'functions', v: 'round · min · max · abs' },
    ],
  },
];

export function BatteriesIncluded() {
  return (
    <section id="features" className="fc-batteries fc-ground-surface">
      <div className="fc-batteries__inner">
        <div className="fc-batteries__eyebrow">Batteries included</div>
        <h2 className="fc-batteries__h2">
          The parts you would otherwise write twice.
        </h2>
        <p className="fc-batteries__sub fc-v2-block-gap">
          Four behaviours that are tedious to build by hand and easy to get
          subtly wrong. Each one is already a line of schema.
        </p>

        <div className="fc-batteries__grid">
          {features.map((f) => (
            <div key={f.n} className="fc-batteries__card">
              <div className="fc-batteries__card-head">
                <span className="fc-batteries__n">{f.n}</span>
                <span className="fc-batteries__card-title">{f.title}</span>
                <span className="fc-batteries__badge">{f.badge}</span>
              </div>

              <div className="fc-batteries__code">
                {f.code.map((line) => (
                  <div key={line.k} className="fc-batteries__code-line">
                    <span className="fc-batteries__code-k">{line.k}</span>
                    {line.v && (
                      <>
                        <span className="fc-batteries__code-p">: </span>
                        <span className="fc-batteries__code-v">{line.v}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
