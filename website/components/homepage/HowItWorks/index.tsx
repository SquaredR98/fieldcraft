import './styles.css';

/*
 * Quick start — the section directly under the hero.
 *
 * The hero shows THAT a schema renders a working form. This answers the
 * question that leaves open: what do I actually type. Three steps, one
 * line of real code each, nothing to interpret.
 *
 * Step 02 used to carry the lead treatment and a corner bracket, with a
 * subtitle saying "step 02 is the one that matters". That was true when
 * the hero was a tabbed card — but the hero now shows the schema beside
 * the form it produces, at full width, so repeating the point in a
 * smaller box is the same argument twice. The three steps are peers now.
 */
export function HowItWorks() {
  return (
    <section id="how" className="fc-how fc-ground-surface2">
      <div className="fc-how__inner">
        <div className="fc-how__eyebrow">How it works</div>
        {/* "...and no account anywhere" was the old heading's second
            half. Same problem as the data-sovereignty section this
            replaced: not needing an account is the baseline for an npm
            package, not a selling point. */}
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
            {/* The dependency rationale (zod, Radix, dompurify, and why
                each) was four lines here. All true, but it is an
                architecture note in the middle of a quick start —
                Architecture is the section that covers it. */}
            <div className="fc-how__step-body">
              One package: the engine and the React renderer.
            </div>
            <div className="fc-how__code">
              <span className="fc-how__code-muted">$</span> npm i
              @squaredr/fieldcraft-react
            </div>
          </div>

          {/* Step 02 — the schema is the product, so this one leads. */}
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
