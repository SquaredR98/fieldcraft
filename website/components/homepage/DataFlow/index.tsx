import type { CSSProperties } from 'react';
import './styles.css';

/*
 * The sovereignty argument, drawn rather than asserted.
 *
 * Structure follows the v2 grammar: an anchored left column carries the
 * framing, the drawing runs right. Steps share borders so each path reads
 * as one continuous drawing rather than stacked chips, and they trace in
 * sequence on reveal — a drawing is read along, not taken in at once.
 *
 * No competitor is named, per Rule 9 in CLAUDE.md. The categories are
 * descriptive and need no upkeep.
 */

type Hop = { n: string; label: string; note: string | null };

const hosted: Hop[] = [
  { n: '01', label: 'Respondent’s browser', note: null },
  { n: '02', label: 'Vendor’s servers', note: 'reads it' },
  { n: '03', label: 'Vendor’s database', note: 'stores it' },
  { n: '04', label: 'You, via their API', note: null },
];

const own: Hop[] = [
  { n: '01', label: 'Respondent’s browser', note: null },
  { n: '02', label: 'Your API endpoint', note: 'your code' },
  { n: '03', label: 'Your database', note: 'the only copy' },
];

const consequences = [
  {
    k: 'DPA',
    title: 'No processor agreement',
    body: 'A vendor that never receives your data is not a data processor, so there is nothing to negotiate, sign or renew.',
  },
  {
    k: 'BAA',
    title: 'No business associate agreement',
    body: 'Under HIPAA a BAA covers parties that handle protected health information. FieldCraft handles none of it.',
  },
  {
    k: 'VSR',
    title: 'No vendor security review',
    body: 'Procurement reviews the software you run, not a third party you send records to. The audit surface is your own stack.',
  },
  {
    k: 'IR',
    title: 'No breach of ours to report',
    body: 'A compromise on our side cannot expose your responses, because we never held a copy. The blast radius stops at your systems.',
  },
];

/** One hop in a path. `--i` drives the staggered trace-in. */
function Step({ hop, i, tone }: { hop: Hop; i: number; tone: 'warn' | 'own' }) {
  return (
    <li
      className={`fc-flow__step${hop.note ? ` fc-flow__step--${tone}` : ''}`}
      style={{ '--i': i } as CSSProperties}
    >
      <span className="fc-flow__step-n">{hop.n}</span>
      <span className="fc-flow__step-l">{hop.label}</span>
      {hop.note && <span className="fc-flow__step-note">{hop.note}</span>}
    </li>
  );
}

export function DataFlow() {
  return (
    <section id="data" className="fc-flow fc-ground-surface2">
      <div className="fc-v2-grid fc-v2-grid--center" aria-hidden="true" />

      <div className="fc-flow__inner">
        <div className="fc-flow__aside">
          <div className="fc-v2-eyebrow">
            <div className="fc-v2-eyebrow__text">Where the data goes</div>
            <div className="fc-v2-eyebrow__rule" />
          </div>
          <h2 className="fc-flow__h2">
            Most form tools put themselves in the path.
          </h2>
          <p className="fc-flow__sub">
            Every hosted service receives your users&rsquo; answers before you
            do. That single architectural fact is what produces the paperwork,
            the audits and the breach exposure that follow it.
          </p>

          <div className="fc-flow__delta">
            <div className="fc-flow__delta-row">
              <span className="fc-flow__delta-k">Hosted</span>
              <span className="fc-flow__delta-v fc-flow__delta-v--warn">
                3 parties
              </span>
            </div>
            <div className="fc-flow__delta-row">
              <span className="fc-flow__delta-k">FieldCraft</span>
              <span className="fc-flow__delta-v fc-flow__delta-v--own">
                1 party
              </span>
            </div>
            <p className="fc-flow__delta-note">
              Parties holding a copy of a submitted response.
            </p>
          </div>
        </div>

        <div className="fc-flow__draw">
          <div className="fc-flow__col">
            <div className="fc-flow__col-head">
              <span className="fc-flow__col-kind">Hosted form service</span>
              <span className="fc-flow__col-tag fc-flow__col-tag--warn">
                4 hops
              </span>
            </div>
            <ol className="fc-flow__steps">
              {hosted.map((hop, i) => (
                <Step key={hop.n} hop={hop} i={i} tone="warn" />
              ))}
            </ol>
          </div>

          <div className="fc-flow__col fc-flow__col--own">
            <div className="fc-v2-bracket fc-v2-bracket--tl" aria-hidden="true" />
            <div className="fc-v2-bracket fc-v2-bracket--br" aria-hidden="true" />
            <div className="fc-flow__col-head">
              <span className="fc-flow__col-kind fc-flow__col-kind--own">
                FieldCraft
              </span>
              <span className="fc-flow__col-tag fc-flow__col-tag--own">
                3 hops
              </span>
            </div>
            <ol className="fc-flow__steps">
              {own.map((hop, i) => (
                <Step key={hop.n} hop={hop} i={i} tone="own" />
              ))}
            </ol>
            <div className="fc-flow__absent">
              No step where we receive, store or proxy a response.
            </div>
          </div>
        </div>
      </div>

      {/* Shared-border cells — a spec sheet, not four floating cards. */}
      <div className="fc-flow__consequences">
        <div className="fc-flow__consequences-wrap">
          <div className="fc-flow__consequences-inner">
            {consequences.map((c) => (
              <div key={c.k} className="fc-flow__consequence">
                <div className="fc-flow__consequence-h">
                  <span className="fc-flow__consequence-k">{c.k}</span>
                  <span className="fc-flow__consequence-t">{c.title}</span>
                </div>
                <p className="fc-flow__consequence-b">{c.body}</p>
              </div>
            ))}
          </div>
          <p className="fc-flow__note">
            A property of the architecture, not a setting: you write the{' '}
            <code>onSubmit</code> handler, so the destination is yours by
            construction. The one call the packages can make to us is anonymous
            usage telemetry &mdash; structural counts, never field values
            &mdash; and it stays off unless you switch it on.
          </p>
        </div>
      </div>
    </section>
  );
}
