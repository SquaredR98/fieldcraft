import './styles.css';

const gaps = [
  {
    title: 'React only, for now',
    body: 'The core is framework-free by design, but React is the only renderer that exists. Anything else, you’d be writing yourself.',
  },
  {
    title: 'No visual builder you can install',
    body: 'One exists and runs on localhost — I use it to write schemas. Making it something other people can rely on is a different amount of work, and I’ll only do it if people actually want it. For now, schemas are written by hand or copied from a template.',
  },
  {
    title: 'Four adapters, not a plugin ecosystem',
    body: 'http, supabase, postgres and webhook. Anywhere else, you write a small adapter — the interface is simple, but it’s still work.',
  },
  {
    title: 'Docs cover the basics',
    body: 'Getting started and the field reference are there. The deeper guides are thin, and some of the API is only documented by its types.',
  },
  {
    title: 'Releases are irregular',
    body: 'This is evenings and weekends. If you file an issue I’ll read it; I can’t promise when I’ll get to it.',
  },
];

export function KnownGaps() {
  return (
    <section id="gaps" className="fc-gaps">
      <div className="fc-gaps__inner">
        <div className="fc-gaps__eyebrow">What&rsquo;s missing</div>
        <h2 className="fc-gaps__h2">
          Things you should know before you rely on it.
        </h2>
        <p className="fc-gaps__sub">
          I&rsquo;d rather you find these here than three days into a project.
        </p>
        <div className="fc-gaps__list">
          {gaps.map((gap) => (
            <div key={gap.title} className="fc-gaps__row">
              <div className="fc-gaps__row-title">{gap.title}</div>
              <div className="fc-gaps__row-body">{gap.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
