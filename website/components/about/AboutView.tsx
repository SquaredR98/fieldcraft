import '@/components/homepage/v2.css';
import './styles.css';

/*
 * The founder narrative, moved off the homepage. It stays honest — the
 * slowdown and the missing docs are still stated plainly — but it lives
 * where someone who wants the story can find it, rather than being the
 * first thing a person evaluating the library reads.
 */

const lessons = [
  {
    title: 'Publishing is a whole skill',
    body: 'A scoped npm org, four packages that depend on each other, build outputs that work in both ESM and CJS, and versions that don’t contradict one another. None of that is writing features.',
  },
  {
    title: 'Tests are how you come back',
    body: '1,270 tests weren’t for correctness so much as for me — they’re the only reason I can still change the engine after forgetting how it works.',
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

export function AboutView() {
  return (
    <>
      <section className="fc-about-hero">
        <div className="fc-v2-grid" aria-hidden="true" />
        <div className="fc-about__inner fc-about-hero__inner">
          <div className="fc-v2-eyebrow">
            <div className="fc-v2-eyebrow__text">About</div>
            <div className="fc-v2-eyebrow__rule" />
          </div>
          <h1 className="fc-about-hero__h1">
            One developer, evenings and weekends.
          </h1>
          <div className="fc-v2-tick" />
          <p className="fc-about-hero__sub">
            FieldCraft is built and maintained by one person. That shapes what
            it is good at and what it is not, so it is worth saying plainly
            rather than leaving you to find out.
          </p>
        </div>
      </section>

      <section className="fc-v2-section fc-about-body">
        <div className="fc-about__inner fc-about__cols">
          <div className="fc-about__aside">
            <div className="fc-v2-eyebrow">
              <div className="fc-v2-eyebrow__text">Why I built it</div>
              <div className="fc-v2-eyebrow__rule" />
            </div>
            <h2 className="fc-v2-h2">
              I wanted to see how a package of mine holds up once it&rsquo;s
              published.
            </h2>
            <div className="fc-v2-tick fc-about__aside-tick" />
          </div>
          <div className="fc-about__prose">
            <p className="fc-about__lead">
              So I picked something big enough to find out: a form engine. Forms
              have enough real problems &mdash; validation, branching, steps,
              drafts, submission &mdash; that you can&rsquo;t fake your way
              through them.
            </p>
            <p>
              Somewhere in the middle I stopped writing things down. Coming back
              to it now, I spend more time relearning my own code than adding to
              it, which is why fixes and features have slowed. Documenting the
              decisions as I make them is the fix, and it is underway.
            </p>
            <p>
              If you&rsquo;re here from a CV or a link: the interesting part
              isn&rsquo;t the marketing, it&rsquo;s the code, the tests, and the
              parts I got wrong. Those are all in the repo.
            </p>
            <a
              href="https://github.com/SquaredR98/fieldcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="fc-about__link"
            >
              Read the source{' '}
              <span className="fc-v2-link__arrow">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      <section className="fc-v2-section fc-v2-section--plate fc-about-learned">
        <div className="fc-about__inner">
          <div className="fc-v2-eyebrow">
            <div className="fc-v2-eyebrow__text">What I learned</div>
            <div className="fc-v2-eyebrow__rule" />
          </div>
          <h2 className="fc-v2-h2">Mostly that shipping is the hard part.</h2>
          <p className="fc-v2-sub fc-about-learned__sub">
            The engine was the fun bit. Everything around it is where the actual
            lessons were.
          </p>
          <div className="fc-about-learned__grid">
            {lessons.map((lesson) => (
              <div key={lesson.title} className="fc-about-learned__item">
                <div className="fc-about-learned__item-t">{lesson.title}</div>
                <p className="fc-about-learned__item-b">{lesson.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fc-v2-section fc-about-cta">
        <div className="fc-about__inner fc-about-cta__inner">
          <div>
            <h2 className="fc-v2-h2">The scope is on the homepage.</h2>
            <p className="fc-v2-sub fc-about-cta__sub">
              What the library does and does not cover is listed there, in
              full, before you install anything.
            </p>
          </div>
          <div className="fc-about-cta__actions">
            <a href="/#scope" className="fc-v2-cta">
              See the scope <span className="fc-v2-cta__arrow">→</span>
            </a>
            <a href="/docs" className="fc-v2-btn">Read the docs</a>
          </div>
        </div>
      </section>
    </>
  );
}
