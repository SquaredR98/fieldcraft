import Link from 'next/link';
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
    // Was "HTTP, Supabase, Postgres, webhooks". There is no HTTP
    // adapter — packages/adapters/src holds exactly three, and the
    // package's own dev banner prints the same three. This was the
    // THIRD surface carrying that invented claim, after Architecture
    // and Scope.
    desc: 'Postgres, Supabase, webhook',
    license: 'MIT',
  },
  {
    name: '@squaredr/fieldcraft-templates',
    desc: '16 starter schemas',
    license: 'MIT',
  },
];

export function FinalCta() {
  return (
    <section id="start" className="fc-cta fc-ground-surface2">
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
            <Link href="/docs" className="fc-v2-cta">
              Read the docs <span className="fc-v2-cta__arrow">&rarr;</span>
            </Link>
            <a
              href="https://github.com/SquaredR98/fieldcraft"
              className="fc-v2-btn"
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
