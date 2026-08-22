import type { ChangelogEntry, ChangeType, PlannedGroup } from '@/lib/changelog';
import './styles.css';

interface ChangelogViewProps {
  entries: ChangelogEntry[];
  planned: PlannedGroup[];
}

const packageColors: Record<string, string> = {
  core: 'fc-roadmap__pkg--core',
  react: 'fc-roadmap__pkg--react',
  pro: 'fc-roadmap__pkg--pro',
};

const changeTypeLabels: Record<ChangeType, string> = {
  added: 'Added',
  fixed: 'Fixed',
  changed: 'Changed',
};

function PackageBadge({ pkg }: { pkg: string }) {
  return (
    <span className={`fc-roadmap__pkg ${packageColors[pkg] ?? ''}`}>
      {pkg}
    </span>
  );
}

function ChangeTag({ type }: { type: ChangeType }) {
  return (
    <span className={`fc-roadmap__change-tag fc-roadmap__change-tag--${type}`}>
      {changeTypeLabels[type]}
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ChangelogView({ entries, planned }: ChangelogViewProps) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="fc-roadmap">
      <div className="fc-roadmap__inner">
        {/* ── Header ── */}
        <div className="fc-roadmap__header">
          <div className="fc-roadmap__eyebrow">Changelog</div>
          <h1 className="fc-roadmap__h1">What we&rsquo;ve shipped.</h1>
          <p className="fc-roadmap__sub">
            Version history across all FieldCraft packages.{' '}
            <a
              href="https://github.com/SquaredR98/fieldcraft/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="fc-roadmap__link"
            >
              Request a feature &rarr;
            </a>
          </p>
        </div>

        {/* ── Changelog entries ── */}
        <div className="fc-roadmap__timeline">
          {sorted.map((entry) => (
            <div
              key={`${entry.package}-${entry.version}`}
              className="fc-roadmap__entry"
            >
              <div className="fc-roadmap__entry-header">
                <div className="fc-roadmap__version-row">
                  <span className="fc-roadmap__version">
                    v{entry.version}
                  </span>
                  <PackageBadge pkg={entry.package} />
                </div>
                <span className="fc-roadmap__date">
                  {formatDate(entry.date)}
                </span>
              </div>

              <ul className="fc-roadmap__changes">
                {entry.changes.map((change, i) => (
                  <li key={i} className="fc-roadmap__change">
                    <ChangeTag type={change.type} />
                    <span className="fc-roadmap__change-text">
                      {change.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Planned ── */}
        {planned.length > 0 && (
          <div className="fc-roadmap__planned">
            <h2 className="fc-roadmap__h2">Coming next</h2>
            {planned.map((group) => (
              <div key={group.period} className="fc-roadmap__group">
                <div className="fc-roadmap__period">{group.period}</div>
                <ul className="fc-roadmap__list">
                  {group.items.map((item) => (
                    <li key={item.title} className="fc-roadmap__item">
                      <span className="fc-roadmap__item-title">
                        {item.title}
                      </span>
                      <span className="fc-roadmap__tag fc-roadmap__tag--planned">
                        Planned
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
