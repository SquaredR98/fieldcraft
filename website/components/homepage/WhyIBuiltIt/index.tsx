import './styles.css';

export function WhyIBuiltIt() {
  return (
    <section id="why" className="fc-why">
      <div className="fc-why__inner">
        <div className="fc-why__heading">
          <div className="fc-why__eyebrow">Why I built it</div>
          <h2 className="fc-why__h2">
            I wanted to see how a package of mine holds up once it&rsquo;s
            published.
          </h2>
        </div>
        <div className="fc-why__body">
          <p>
            So I picked something big enough to find out: a form engine. Forms
            have enough real problems &mdash; validation, branching, steps,
            drafts, submission &mdash; that you can&rsquo;t fake your way
            through them.
          </p>
          <p>
            Somewhere in the middle I stopped writing things down. Coming back
            to it now, I spend more time relearning my own code than adding to
            it, which is why fixes and features have slowed. This page is part
            of fixing that.
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
            className="fc-why__link"
          >
            Read the source &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
