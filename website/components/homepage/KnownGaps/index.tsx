import type { CSSProperties } from 'react';
import './styles.css';

/*
 * Scope — the one section that gets the amber treatment.
 *
 * Per the v2 spec: "This is the one section on the page that gets the
 * amber treatment. Honesty is the point, so it should look deliberate."
 * Amber appears nowhere else on the homepage, which is what makes it
 * read as a considered disclosure rather than a warning.
 *
 * Layout follows the spec's 1fr/1.5fr split: the framing is anchored
 * left, the ledger of limits runs right.
 */

const gaps = [
  {
    title: 'React only',
    body: 'The core is framework-free by design and ships no UI, but React is the only renderer that exists today. Another framework means writing that layer yourself.',
  },
  {
    title: 'Schemas are written, not drawn',
    body: 'A visual builder exists and ships in Pro. On the free tier, schemas are hand-written or started from one of the 16 templates.',
  },
  {
    title: 'Four adapters, not an ecosystem',
    body: 'http, supabase, postgres and webhook are included. Anywhere else is a small adapter you write — the interface is one method, but it is still work.',
  },
  {
    title: 'Docs cover the common path',
    body: 'Getting started and the field reference are complete. The deeper guides are thin, and some of the API is documented only by its TypeScript types.',
  },
  {
    title: 'Releases are irregular',
    body: 'This is one developer working evenings and weekends. Issues get read; timelines are not promised.',
  },
];

export function KnownGaps() {
  return (
    <section id="scope" className="fc-gaps fc-ground-surface">
      <div className="fc-gaps__inner">
        <div className="fc-gaps__aside">
          <div className="fc-gaps__eyebrow">Scope</div>
          <h2 className="fc-gaps__h2">
            Things you should know before you rely on it.
          </h2>
          <p className="fc-gaps__sub">
            Better to find these here than three days into a project.
          </p>
          <div className="fc-gaps__callout">
            <div className="fc-gaps__callout-label">
              {gaps.length} open gaps
            </div>
            Every one of these is on the roadmap or explicitly out of scope
            &mdash; none of them is an oversight. If one of them blocks you,
            say so in an issue and it moves up.
          </div>
        </div>

        <div className="fc-gaps__ledger">
          {gaps.map((gap, i) => (
            <div
              key={gap.title}
              className="fc-gaps__row"
              style={{ "--i": i } as CSSProperties}
            >
              <div className="fc-gaps__row-n">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <div className="fc-gaps__row-title">{gap.title}</div>
                <p className="fc-gaps__row-body">{gap.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
