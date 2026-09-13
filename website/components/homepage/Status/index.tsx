import './styles.css';

interface StatusProps {
  latestVersion: string;
  latestDate: string;
  latestPackage: string;
}

export function Status({
  latestVersion,
  latestDate,
  latestPackage,
}: StatusProps) {
  return (
    <section id="status" className="fc-status fc-ground-surface2">
      <div className="fc-status__inner">
        <div className="fc-status__eyebrow">Status</div>
        <h2 className="fc-status__h2">Where it stands right now.</h2>
        <p className="fc-status__sub fc-v2-block-gap">
          Stated plainly, and kept current &mdash; the release figure below
          comes from the changelog, not from this page.
        </p>
        <div className="fc-status__grid">
          <div className="fc-status__card fc-status__card--lead">
            <div className="fc-v2-bracket fc-v2-bracket--tl" aria-hidden="true" />
            <div className="fc-status__label">Latest release</div>
            <div className="fc-status__version">
              {latestPackage} {latestVersion}
            </div>
            <div className="fc-status__meta">
              Published {latestDate}. Full history in the changelog.
            </div>
          </div>
          <div className="fc-status__card">
            <div className="fc-status__label">What I&rsquo;m doing next</div>
            <div className="fc-status__body">
              Writing down how the engine actually works, so the next fix
              doesn&rsquo;t start with an hour of reading my own code.
            </div>
          </div>
          <div className="fc-status__card">
            <div className="fc-status__label">If you want to help</div>
            <div className="fc-status__body">
              Use it and tell me what broke. Bug reports with a schema attached
              are the most useful thing I get.
            </div>
            <div className="fc-status__links">
              <a
                href="https://github.com/SquaredR98/fieldcraft/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open an issue{" "}
                <span className="fc-v2-link__arrow">&rarr;</span>
              </a>
              <a href="/changelog">
                Changelog <span className="fc-v2-link__arrow">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
