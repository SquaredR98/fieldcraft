import './styles.css';

const points = [
  {
    title: 'Your data never leaves your servers',
    body: 'Form submissions go directly to your database. No third-party ever sees, stores, or proxies your users\u2019 responses.',
  },
  {
    title: 'No tracking, no telemetry by default',
    body: 'The engine collects nothing about your users. No cookies, no fingerprints, no analytics payloads. Your forms are just code running on your infrastructure.',
  },
  {
    title: 'HIPAA and GDPR-ready by architecture',
    body: 'Self-hosted means you control the compliance boundary. Field-level encryption, row-level security, and audit logging are built into the adapter layer.',
  },
  {
    title: 'MIT source you can audit and fork',
    body: 'Every line of the engine, renderer, and adapters is open source. If you need to verify what the code does, read it. If you need to change it, fork it.',
  },
];

export function TrustStrip() {
  return (
    <section className="fc-trust">
      <div className="fc-trust__inner">
        <div className="fc-trust__eyebrow">
          Data ownership
        </div>
        <h2 className="fc-trust__h2">
          Your forms. Your data. Full stop.
        </h2>
        <p className="fc-trust__sub">
          FieldCraft runs entirely on your infrastructure. Submissions flow from
          the browser to your database with zero third-party intermediaries.
        </p>
        <div className="fc-trust__grid">
          {points.map((p) => (
            <div key={p.title} className="fc-trust__card">
              <div className="fc-trust__card-title">{p.title}</div>
              <div className="fc-trust__card-body">{p.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
