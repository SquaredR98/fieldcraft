import './styles.css';

const lessons = [
  {
    title: 'Publishing is a whole skill',
    body: 'A scoped npm org, four packages that depend on each other, build outputs that work in both ESM and CJS, and versions that don’t contradict one another. None of that is writing features.',
  },
  {
    title: 'Tests are how you come back',
    body: '1,151 tests weren’t for correctness so much as for me — they’re the only reason I can still change the engine after forgetting how it works.',
  },
  {
    title: 'Validate the input, not the user',
    body: 'Checking the schema at boot instead of trusting it at runtime removed a whole category of confusing bugs. Obvious afterwards; wasn’t obvious to me at the start.',
  },
  {
    title: 'Write it down as you go',
    body: 'The main thing I’d do differently. Undocumented decisions cost me more time than any bug did.',
  },
];

export function WhatILearned() {
  return (
    <section id="learned" className="fc-learned">
      <div className="fc-learned__inner">
        <div className="fc-learned__eyebrow">What I learned</div>
        <h2 className="fc-learned__h2">
          Mostly that shipping is the hard part.
        </h2>
        <p className="fc-learned__sub">
          The engine was the fun bit. Everything around it is where the actual
          lessons were.
        </p>
        <div className="fc-learned__grid">
          {lessons.map((lesson) => (
            <div key={lesson.title} className="fc-learned__item">
              <div className="fc-learned__item-title">{lesson.title}</div>
              <p className="fc-learned__item-body">{lesson.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
