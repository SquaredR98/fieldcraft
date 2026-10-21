import './styles.css';

export function HowItWorks() {
  return (
    <section id="how" className="fc-how fc-ground-surface2">
      <div className="fc-how__inner">
        <div className="fc-how__eyebrow">How it works</div>
        <h2 className="fc-how__h2 fc-v2-block-gap">
          Install, describe, render.
        </h2>
        <div className="fc-how__grid">
          {/* Step 01 */}
          <div className="fc-how__step">
            <div className="fc-how__step-header">
              <div className="fc-how__chip">01</div>
              <div className="fc-how__step-title">Install</div>
            </div>
            <div className="fc-how__step-body">
              One package: the engine and the React renderer.
            </div>
            <div className="fc-how__code">
              <span className="fc-how__code-muted">$</span> npm i
              @squaredr/fieldcraft-react
            </div>
          </div>

          {/* Step 02 */}
          <div className="fc-how__step">
            <div className="fc-how__step-header">
              <div className="fc-how__chip">02</div>
              <div className="fc-how__step-title">Describe the form</div>
            </div>
            <div className="fc-how__step-body">
              Plain JSON &mdash; versionable, diffable, reviewable in a pull
              request.
            </div>
            <div className="fc-how__code">
              <div>
                <span className="fc-how__code-key">const</span> schema = {'{'}
              </div>
              <div className="pl-3.5">
                <span className="fc-how__code-key">id</span>:{' '}
                <span className="fc-how__code-string">&quot;signup&quot;</span>,
              </div>
              <div className="pl-3.5">
                <span className="fc-how__code-key">questions</span>: [ &hellip;
                ]
              </div>
              <div>{'}'}</div>
            </div>
          </div>

          {/* Step 03 */}
          <div className="fc-how__step">
            <div className="fc-how__step-header">
              <div className="fc-how__chip">03</div>
              <div className="fc-how__step-title">Render</div>
            </div>
            <div className="fc-how__step-body">
              One component. Server-rendering safe, React 18 and 19.
            </div>
            <div className="fc-how__code">
              <div>
                &lt;<span className="fc-how__code-key">FormEngineRenderer</span>
              </div>
              <div className="pl-3.5">
                <span className="fc-how__code-string">schema</span>
                ={'{'}schema{'}'}
              </div>
              <div className="pl-3.5">
                <span className="fc-how__code-string">onSubmit</span>
                ={'{'}save{'}'} /&gt;
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
