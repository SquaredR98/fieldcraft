import './styles.css';

const adapters = [
  {
    name: 'http',
    body: 'POST to any endpoint with timeouts, payload transforms and custom headers.',
    licence: 'Built in',
  },
  {
    name: 'supabase',
    body: 'Insert with row-level security respected and optional field-level encryption.',
    licence: 'MIT \u00b7 free',
  },
  {
    name: 'postgres',
    body: 'Write through Drizzle ORM, with per-field encryption where you need it.',
    licence: 'MIT \u00b7 free',
  },
  {
    name: 'webhook',
    body: 'HMAC-SHA256 signed payloads with automatic retries on failure.',
    licence: 'MIT \u00b7 free',
  },
];

export function SubmissionPipeline() {
  return (
    <section className="fc-pipeline">
      <div className="fc-pipeline__inner">
        <div className="fc-pipeline__eyebrow">
          08 &middot; Submission pipeline
        </div>
        <h2 className="fc-pipeline__h2">
          One submit. Every destination you need.
        </h2>
        <p className="fc-pipeline__sub">
          Adapters run concurrently and independently &mdash; if one destination
          is down, the others still complete, and the failure is reported rather
          than swallowed.
        </p>
        <div className="fc-pipeline__grid">
          {adapters.map((a) => (
            <div key={a.name} className="fc-pipeline__card">
              <div className="fc-pipeline__card-name">{a.name}</div>
              <div className="fc-pipeline__card-body">{a.body}</div>
              <div className="fc-pipeline__card-licence">{a.licence}</div>
            </div>
          ))}
        </div>
        <div className="fc-pipeline__install">
          INSTALL: npm i @squaredr/fieldcraft-adapters
        </div>
      </div>
    </section>
  );
}
