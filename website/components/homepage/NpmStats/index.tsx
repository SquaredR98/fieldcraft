import type { NpmStatsData } from '@/lib/npm-stats';
import './styles.css';

interface NpmStatsProps {
  stats: NpmStatsData;
}

export function NpmStats({ stats }: NpmStatsProps) {
  return (
    <section className="fc-npm-stats">
      <div className="fc-npm-stats__inner">
        <div className="fc-npm-stats__header">
          <div className="fc-npm-stats__eyebrow">Community</div>
          <h2 className="fc-npm-stats__h2">Growing every week.</h2>
          <p className="fc-npm-stats__sub">
            Monthly downloads across all FieldCraft packages.
          </p>
        </div>

        <div className="fc-npm-stats__grid">
          {stats.packages.map((pkg) => (
            <a
              key={pkg.name}
              href={pkg.npmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="fc-npm-stats__card"
            >
              <div className="fc-npm-stats__pkg">{pkg.shortName}</div>
              <div className="fc-npm-stats__count">
                {pkg.downloads.toLocaleString('en-US')}
              </div>
              <div className="fc-npm-stats__label">monthly downloads</div>
              <div className="fc-npm-stats__install">{pkg.installCmd}</div>
            </a>
          ))}
        </div>

        <div className="fc-npm-stats__footer">
          <span className="fc-npm-stats__total">
            {stats.totalMonthly.toLocaleString('en-US')} total monthly downloads
          </span>
          <span className="fc-npm-stats__sep">&middot;</span>
          <span className="fc-npm-stats__note">Updated on each deploy</span>
        </div>
      </div>
    </section>
  );
}
