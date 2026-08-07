import type { RoadmapGroup, ItemStatus } from '@/lib/roadmap';
import './styles.css';

interface RoadmapViewProps {
  groups: RoadmapGroup[];
}

function StatusTag({ status }: { status: ItemStatus }) {
  return (
    <span
      className={`fc-roadmap__tag ${
        status === 'shipped'
          ? 'fc-roadmap__tag--shipped'
          : 'fc-roadmap__tag--planned'
      }`}
    >
      {status === 'shipped' ? 'Shipped' : 'Planned'}
    </span>
  );
}

export function RoadmapView({ groups }: RoadmapViewProps) {
  return (
    <div className="fc-roadmap">
      <div className="fc-roadmap__inner">
        <div className="fc-roadmap__header">
          <div className="fc-roadmap__eyebrow">Roadmap</div>
          <h1 className="fc-roadmap__h1">What&rsquo;s shipped, what&rsquo;s next.</h1>
          <p className="fc-roadmap__sub">
            Have a feature request?{' '}
            <a
              href="https://github.com/SquaredR98/fieldcraft/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="fc-roadmap__link"
            >
              Open an issue on GitHub &rarr;
            </a>
          </p>
        </div>

        <div className="fc-roadmap__timeline">
          {groups.map((group) => (
            <div key={group.period} className="fc-roadmap__group">
              <div className="fc-roadmap__period">{group.period}</div>
              <ul className="fc-roadmap__list">
                {group.items.map((item) => (
                  <li key={item.title} className="fc-roadmap__item">
                    <span className="fc-roadmap__item-title">{item.title}</span>
                    <StatusTag status={item.status} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
