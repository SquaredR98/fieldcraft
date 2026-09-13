import './styles.css';

/*
 * The evidence behind the claim, not a restatement of it.
 *
 * DataFlow argues that nothing passes through us. This section shows the
 * four places you can go and check. Every line here is verifiable — a
 * file to read, a flag to inspect, a licence to audit. That is why each
 * point carries a proof reference rather than an adjective.
 *
 * Claims were checked against source 2026-09-12: AES-256-GCM encryption
 * exists in the postgres adapter; row-level security and audit logging
 * do NOT exist and were removed from this copy.
 */

const points = [
  {
    k: 'src',
    title: 'No endpoint of ours in the package',
    body: 'Every network call the engine makes takes a URL you supply. There is no hardcoded destination to intercept, because there is no destination we own.',
    proof: 'core/src/adapters/http-adapter.ts',
  },
  {
    k: 'flag',
    title: 'Telemetry is off until you turn it on',
    body: 'Anonymous usage counts — field types, feature flags, versions — can be enabled with one option. No field values, ever, and nothing at all by default.',
    proof: 'telemetry: true',
  },
  {
    k: 'aes',
    title: 'Encryption at the adapter, if you want it',
    body: 'The postgres adapter will AES-256-GCM your response payload before it is written, using a key that never leaves your environment.',
    proof: 'adapters/src/postgres/encryption.ts',
  },
  {
    k: 'mit',
    title: 'All of it readable, all of it forkable',
    body: 'Engine, renderer and adapters are MIT. If you need to verify any claim on this page, the code is the thing to read — not this page.',
    proof: 'MIT · github.com/SquaredR98',
  },
];

export function TrustStrip() {
  return (
    <section className="fc-trust fc-ground-surface">
      <div className="fc-trust__inner">
        <div className="fc-trust__aside">
          <div className="fc-trust__eyebrow">How to check</div>
          <h2 className="fc-trust__h2">
            Don&rsquo;t take the last section on faith.
          </h2>
          <p className="fc-trust__sub">
            Four places you can verify the claim yourself, without
            installing anything. Each one names the file or the flag.
          </p>
          <div className="fc-trust__jump">
            <a
              href="https://github.com/SquaredR98/fieldcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="fc-v2-link"
            >
              Read the source{' '}
              <span className="fc-v2-link__arrow">&rarr;</span>
            </a>
          </div>
        </div>

        <div className="fc-trust__grid">
          {points.map((p) => (
            <div key={p.k} className="fc-trust__card">
              <div className="fc-trust__card-title">{p.title}</div>
              <div className="fc-trust__card-body">{p.body}</div>
              <div className="fc-trust__card-proof">
                <span className="fc-trust__card-proof-k">{p.k}</span>
                <code>{p.proof}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
