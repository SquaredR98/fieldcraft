import './styles.css';

export function Architecture() {
  return (
    <section id="layers" className="fc-arch fc-ground-surface">
      <div className="fc-arch__inner">
        <div className="fc-arch__eyebrow">Architecture</div>
        <h2 className="fc-arch__h2">
          Two layers, four packages.
        </h2>
        <p className="fc-arch__sub fc-v2-block-gap">
          The engine is plain TypeScript with no UI dependencies. The React
          renderer sits on top of it and adds the field components. Install
          whichever one you need.
        </p>

        <div className="fc-arch__grid">
          {/* ── Left column: nested layer diagram ── */}
          <div>
            <div className="fc-arch__layer fc-arch__layer--react">
              <div className="fc-arch__layer-header">
                <span className="fc-arch__layer-label">
                  Layer 02 &middot; renderer &middot; MIT
                </span>
                <span className="fc-arch__layer-badge fc-arch__layer-badge--teal">
                  React
                </span>
              </div>
              <div className="fc-arch__layer-pkg">
                @squaredr/fieldcraft-react
              </div>
              <div className="fc-arch__layer-desc">
                Accessible components for every field type, themeable from
                CSS custom properties.
              </div>

              <div className="fc-arch__layer fc-arch__layer--core">
                <div className="fc-arch__layer-header">
                  <span className="fc-arch__layer-label">
                    Layer 01 &middot; engine &middot; MIT
                  </span>
                  <span className="fc-arch__layer-badge fc-arch__layer-badge--muted">
                    Framework-free
                  </span>
                </div>
                <div className="fc-arch__layer-pkg">
                  @squaredr/fieldcraft-core
                </div>
                <div className="fc-arch__layer-desc">
                  Validation, conditions, navigation, drafts and submission.
                  Zero UI dependencies.
                </div>
              </div>
            </div>

            <div className="fc-arch__callout">
              <div className="fc-arch__callout-title">
                Built for React. Open to every framework.
              </div>
              {/* Kept, and it is not an empty invitation: the engine is
                  MIT and the React renderer is in the same repo, so a
                  Vue or Svelte renderer has a working reference to read
                  rather than an API to guess at. */}
              <div className="fc-arch__callout-text">
                Layer 01 has no UI dependencies, and the React renderer is
                MIT in the same repo &mdash; a working reference for anyone
                writing one for Vue, Svelte or Solid.
              </div>
              <a
                href="https://github.com/SquaredR98/fieldcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="fc-v2-link fc-arch__contribute-link"
              >
                Contribute on GitHub{' '}
                <span className="fc-v2-link__arrow">&rarr;</span>
              </a>
            </div>
          </div>

          {/* ── Right column: hairline-stacked sidebar ── */}
          <div className="fc-arch__sidebar">
            {/* "Reading the diagram" was a paragraph explaining that each
                box nests inside the one above. The diagram shows that. */}
            <div className="fc-arch__sidebar-item">
              <div className="fc-arch__sidebar-pkg">
                @squaredr/fieldcraft-adapters
              </div>
              {/* Named, not described. This said they load schemas "over
                  HTTP, from localStorage, or from a custom source" — wrong
                  on the names AND the job. They deliver submissions. */}
              <div className="fc-arch__sidebar-text">
                Postgres, Supabase and webhook destinations for submitted
                responses. Core types only &mdash; no React.
              </div>
            </div>

            <div className="fc-arch__sidebar-item">
              <div className="fc-arch__sidebar-pkg">
                @squaredr/fieldcraft-templates
              </div>
              <div className="fc-arch__sidebar-text">
                16 ready-made schemas &mdash; contact, feedback, onboarding,
                intake. Import one and edit it.
              </div>
            </div>

            <div className="fc-arch__sidebar-item">
              <div className="fc-arch__sidebar-title">Pick your entry point</div>
              <table className="fc-arch__entry-table">
                <tbody>
                  <tr className="fc-arch__entry-row">
                    <td>Core</td>
                    <td>Bring your own UI.</td>
                  </tr>
                  <tr className="fc-arch__entry-row">
                    <td>React</td>
                    <td>Components included.</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
