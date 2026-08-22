import '../shared.css';
import './styles.css';

export function ProProblem() {
  return (
    <section className="fc-pro-section fc-pro-section--surface">
      <div className="fc-pro-section__inner">
        <div className="fc-pro-eyebrow">
          <div className="fc-pro-eyebrow__dot" />
          The problem
        </div>
        <h2 className="fc-pro-h2" style={{ maxWidth: 680 }}>
          Form administration is where side projects go to die
        </h2>
        <p className="fc-pro-sub">
          The form is the easy part. The panel around it — builder, responses,
          theming, exports — is the quarter you did not plan for.
        </p>

        <div className="fc-pro-grid-1px fc-pro-grid-1px--3col" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          {/* Option A */}
          <div>
            <div className="fc-pro-problem__label">Option A</div>
            <div className="fc-pro-problem__title">Build it yourself</div>
            <ul className="fc-pro-problem__bullets">
              <li className="fc-pro-problem__bullet">
                <span className="fc-pro-problem__x">&times;</span>
                <span>Drag-and-drop editing is three weeks before it feels right</span>
              </li>
              <li className="fc-pro-problem__bullet">
                <span className="fc-pro-problem__x">&times;</span>
                <span>Undo/redo and keyboard support get cut from scope</span>
              </li>
              <li className="fc-pro-problem__bullet">
                <span className="fc-pro-problem__x">&times;</span>
                <span>Response tables, filters and CSV export rebuilt per project</span>
              </li>
              <li className="fc-pro-problem__bullet">
                <span className="fc-pro-problem__x">&times;</span>
                <span>You now maintain an internal product nobody asked for</span>
              </li>
            </ul>
          </div>

          {/* Option B */}
          <div>
            <div className="fc-pro-problem__label">Option B</div>
            <div className="fc-pro-problem__title">Use a hosted service</div>
            <ul className="fc-pro-problem__bullets">
              <li className="fc-pro-problem__bullet">
                <span className="fc-pro-problem__x">&times;</span>
                <span>Per-response pricing that scales against you</span>
              </li>
              <li className="fc-pro-problem__bullet">
                <span className="fc-pro-problem__x">&times;</span>
                <span>Submissions live in someone else&rsquo;s database</span>
              </li>
              <li className="fc-pro-problem__bullet">
                <span className="fc-pro-problem__x">&times;</span>
                <span>An iframe you cannot style to match your product</span>
              </li>
              <li className="fc-pro-problem__bullet">
                <span className="fc-pro-problem__x">&times;</span>
                <span>Compliance review every time the vendor changes terms</span>
              </li>
            </ul>
          </div>

          {/* Option C — highlight */}
          <div className="fc-pro-problem__highlight">
            <div className="fc-pro-problem__label fc-pro-problem__label--teal">
              <span>Option C</span>
              <span className="fc-pro-problem__recommended">Recommended</span>
            </div>
            <div className="fc-pro-problem__title">FieldCraft Pro</div>
            <ul className="fc-pro-problem__bullets">
              <li className="fc-pro-problem__bullet fc-pro-problem__bullet--positive">
                <span className="fc-pro-problem__check">&#10003;</span>
                <span>A finished builder, viewer and theme editor as components</span>
              </li>
              <li className="fc-pro-problem__bullet fc-pro-problem__bullet--positive">
                <span className="fc-pro-problem__check">&#10003;</span>
                <span>Runs in your app, against your database</span>
              </li>
              <li className="fc-pro-problem__bullet fc-pro-problem__bullet--positive">
                <span className="fc-pro-problem__check">&#10003;</span>
                <span>$199 once — no per-response ceiling, ever</span>
              </li>
              <li className="fc-pro-problem__bullet fc-pro-problem__bullet--positive">
                <span className="fc-pro-problem__check">&#10003;</span>
                <span>Built on the MIT-licensed engine you already use</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
