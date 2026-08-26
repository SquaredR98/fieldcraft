import './styles.css';

export function Architecture() {
  return (
    <section id="layers" className="fc-arch">
      <div className="fc-arch__inner">
        <div className="fc-arch__eyebrow">03 &middot; Architecture</div>
        <h2 className="fc-arch__h2">
          Two layers. Take the one you need, leave the rest.
        </h2>
        <p className="fc-arch__sub">
          Each layer is a separate package &mdash; install only what your project
          requires. The core engine has zero UI dependencies, and the React
          renderer adds 42 pre-built components.
        </p>

        <div className="fc-arch__grid">
          {/* ── Left column: nested layer diagram ── */}
          <div>
            <div className="fc-arch__layer fc-arch__layer--pro" style={{ opacity: 0.55 }}>
              <div className="fc-arch__layer-header">
                <span className="fc-arch__layer-label">
                  Layer 03 &middot; Pro &middot; coming soon
                </span>
                <span className="fc-arch__layer-badge fc-arch__layer-badge--amber">
                  UI
                </span>
              </div>
              <div className="fc-arch__layer-title">FieldCraft Pro</div>
              <div className="fc-arch__layer-desc">
                Visual form builder, theme editor, and submission dashboard.
                Coming soon.
              </div>

              <div className="fc-arch__layer fc-arch__layer--react" style={{ opacity: 1 }}>
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
                  Pre-built, accessible React components for every field type.
                  Themeable with CSS custom properties or Tailwind presets.
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
                    Pure TypeScript engine &mdash; validation, conditions,
                    navigation, drafts, and submission. Zero UI dependencies.
                  </div>
                </div>
              </div>
            </div>

            <div className="fc-arch__callout">
              <div className="fc-arch__callout-title">
                Built for React. Open to every framework.
              </div>
              <div className="fc-arch__callout-text">
                The core engine is pure TypeScript with zero UI dependencies.
                React is the official renderer, but the engine API is designed
                for any framework. Vue, Svelte, Angular, Solid &mdash;
                community renderers are welcome and the architecture supports
                them out of the box.
              </div>
              <a
                href="https://github.com/SquaredR98/fieldcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="fc-arch__contribute-link"
              >
                Contribute on GitHub &rarr;
              </a>
            </div>
          </div>

          {/* ── Right column: hairline-stacked sidebar ── */}
          <div className="fc-arch__sidebar">
            <div className="fc-arch__sidebar-item">
              <div className="fc-arch__sidebar-title">Reading the diagram</div>
              <div className="fc-arch__sidebar-text">
                Each box nests inside the one above it. The inner-most layer has
                no dependencies; each outer layer adds capability. Install only
                the outermost layer you need &mdash; its dependencies come along
                automatically.
              </div>
            </div>

            <div className="fc-arch__sidebar-item">
              <div className="fc-arch__sidebar-pkg">
                @squaredr/fieldcraft-adapters
              </div>
              <div className="fc-arch__sidebar-text">
                Plug-in adapters for loading schemas and submitting responses
                over HTTP, from localStorage, or from a custom source. Depends
                on core types only &mdash; no React.
              </div>
            </div>

            <div className="fc-arch__sidebar-item">
              <div className="fc-arch__sidebar-pkg">
                @squaredr/fieldcraft-templates
              </div>
              <div className="fc-arch__sidebar-text">
                Ready-made form schemas for common use cases &mdash; contact,
                feedback, onboarding, and more. Drop one into your project and
                customise.
              </div>
            </div>

            <div className="fc-arch__sidebar-item">
              <div className="fc-arch__sidebar-title">Pick your entry point</div>
              <table className="fc-arch__entry-table">
                <tbody>
                  <tr className="fc-arch__entry-row">
                    <td>Core</td>
                    <td>
                      Bring your own UI. You get the engine, validation, and
                      state management.
                    </td>
                  </tr>
                  <tr className="fc-arch__entry-row">
                    <td>React</td>
                    <td>
                      Full renderer with accessible, themeable components out
                      of the box.
                    </td>
                  </tr>
                  <tr className="fc-arch__entry-row" style={{ opacity: 0.55 }}>
                    <td>Pro</td>
                    <td>
                      Visual builder and dashboard on top of the React
                      renderer. Coming soon.
                    </td>
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
