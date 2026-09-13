import './styles.css';

/*
 * Four behaviours that are tedious to build by hand. This section used to
 * state them as prose, which undersold the only genuinely technical
 * content on the page — so each one now carries the schema or API that
 * enables it, and the cost line says what building it yourself involves.
 *
 * Every claim verified against source 2026-09-12:
 *   drafts      — settings.allowDraftSave, opt-OUT (`!== false`) in
 *                 create-engine.ts:533; auto-save needs autoSaveIntervalMs
 *   prefill     — prefill-resolver.ts declares Layers 1-3, and
 *                 create-engine.ts:493 merges initialValues on top
 *   validation  — validateSchema() runs at create-engine.ts:466, before
 *                 any render; duplicate ids at schema-validator.ts:285
 *   expressions — utils/expression-parser.ts, tokenizer + RPN, and its
 *                 header comment states "No eval()"
 */

type Feature = {
  n: string;
  title: string;
  badge: string;
  body: string;
  /** The line that turns the behaviour on, or the API that provides it. */
  code: { k: string; v?: string }[];
  /** What you write instead, if the engine does not do it for you. */
  cost: string;
};

const features: Feature[] = [
  {
    n: '01',
    title: 'Draft persistence',
    badge: 'On unless disabled',
    body: 'Answers are written to local storage as they change and restored on the next visit. A long intake form survives a closed tab, a refresh, or a dead battery.',
    code: [
      { k: 'settings.allowDraftSave', v: 'true' },
      { k: 'autoSaveIntervalMs', v: '2000' },
    ],
    cost: 'Otherwise: serialise on change, debounce, restore on mount, expire stale drafts.',
  },
  {
    n: '02',
    title: 'Layered prefill',
    badge: 'Fixed precedence',
    body: 'Initial values resolve in a fixed order — schema defaults, then URL parameters, then props — with explicit initial values merged last. Campaign links and personalised forms need no extra code.',
    code: [
      { k: 'question.config.defaultValue' },
      { k: 'settings.prefill', v: '{ fromUrl: true }' },
      { k: 'prefillValues', v: '{ … }' },
    ],
    cost: 'Otherwise: parse the query string, decide precedence, and re-resolve on navigation.',
  },
  {
    n: '03',
    title: 'Schema validation at boot',
    badge: 'Fail fast',
    body: 'Duplicate question ids, conditions pointing at fields that do not exist, and malformed expressions are reported when the engine is created — in development, not in a user’s session.',
    code: [
      { k: 'validateSchema(schema)' },
      { k: 'throws', v: 'FormEngineSchemaError' },
    ],
    cost: 'Otherwise: the first report of a broken condition is a confused user.',
  },
  {
    n: '04',
    title: 'Safe expressions',
    badge: 'No eval',
    body: 'Calculated fields run through a purpose-built parser — tokeniser, postfix conversion, then evaluation — supporting arithmetic, comparisons and a fixed function set. A schema is data, never executable code.',
    code: [
      { k: 'expression', v: '"{qty} * {price}"' },
      { k: 'functions', v: 'round · min · max · if' },
    ],
    cost: 'Otherwise: eval on user-supplied strings, or a parser of your own.',
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
          Four behaviours that are tedious to build and easy to get subtly
          wrong. Each one is a line of schema, and each card says what you
          would be writing instead.
        </p>

        <div className="fc-batteries__grid">
          {features.map((f) => (
            <div key={f.n} className="fc-batteries__card">
              <div className="fc-batteries__card-head">
                <span className="fc-batteries__n">{f.n}</span>
                <span className="fc-batteries__card-title">{f.title}</span>
                <span className="fc-batteries__badge">{f.badge}</span>
              </div>

              <p className="fc-batteries__card-body">{f.body}</p>

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

              <div className="fc-batteries__cost">{f.cost}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
