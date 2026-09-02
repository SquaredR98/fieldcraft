import './styles.css';

const packages = [
  {
    name: '@squaredr/fieldcraft-core',
    desc: 'Engine, types, validation, expressions',
    license: 'MIT',
  },
  {
    name: '@squaredr/fieldcraft-react',
    desc: 'Renderer, steps, drafts, themes',
    license: 'MIT',
  },
  {
    name: '@squaredr/fieldcraft-adapters',
    desc: 'HTTP, Supabase, Postgres, webhooks',
    license: 'MIT',
  },
  {
    name: '@squaredr/fieldcraft-templates',
    desc: 'Starter schemas for common forms',
    license: 'MIT',
  },
];

export function FinalCta() {
  return (
    <section id="start" className="fc-cta">
      <div className="fc-cta__inner">
        {/* ── Left column ── */}
        <div>
          <div className="fc-cta__eyebrow">Try it</div>
          <h2 className="fc-cta__h2">
            Install it, write a schema, render a form.
          </h2>
          <p className="fc-cta__sub">
            Nothing to sign up for. It&rsquo;s on npm, the source is on GitHub,
            and the licence is MIT.
          </p>
          <div className="fc-cta__actions">
            <a href="/docs" className="fc-cta__btn-primary">
              Read the docs &rarr;
            </a>
            <a
              href="https://github.com/SquaredR98/fieldcraft"
              className="fc-cta__btn-outline"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* ── Right column: packages card ── */}
        <div className="fc-cta__card">
          <div className="fc-cta__card-header">The four packages</div>
          {packages.map((pkg) => (
            <div key={pkg.name} className="fc-cta__pkg">
              <div className="fc-cta__pkg-info">
                <div className="fc-cta__pkg-name">{pkg.name}</div>
                <div className="fc-cta__pkg-desc">{pkg.desc}</div>
              </div>
              <div className="fc-cta__pkg-badge">{pkg.license}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
