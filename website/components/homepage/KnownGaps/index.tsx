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
    // Was "A visual builder exists and ships in Pro." Pro is hidden
    // everywhere else on the site — nav CTA, the builder teaser,
    // Architecture's entry table — and this was the one surface still
    // advertising it, in the place a reader is most primed to trust.
    // It is a real constraint for an OSS reader either way, so it is
    // reframed rather than deleted.
    title: 'Schemas are written, not drawn',
    body: 'There is no visual builder. Schemas are hand-written, or started from one of the 16 templates and edited.',
  },
  {
    // Was "Four adapters" listing "http, supabase, postgres and
    // webhook". There is no http adapter — packages/adapters/src holds
    // exactly three, and the package's own dev banner prints the same
    // three. The same invented "HTTP" claim was in the Architecture
    // section.
    title: 'Three adapters, not an ecosystem',
    body: 'Postgres, Supabase and webhook are included. Anywhere else is a small adapter you write — the interface is one method, but it is still work.',
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
          {/* No `--i` style prop: it fed a row stagger whose CSS was
              scoped to ScrollReveal ancestors this section no longer
              has. `i` is still used, for the printed index. */}
          {gaps.map((gap, i) => (
            <div key={gap.title} className="fc-gaps__row">
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
