import type { LegalPage } from '@/lib/legal';
import './styles.css';

interface LegalPageViewProps {
  page: LegalPage;
}

export function LegalPageView({ page }: LegalPageViewProps) {
  return (
    <div className="fc-legal">
      <div className="fc-legal__inner">
        <div className="fc-legal__eyebrow">Legal</div>
        <h1 className="fc-legal__title">{page.title}</h1>
        <div className="fc-legal__updated">
          Last updated: {page.lastUpdated}
        </div>
        <div
          className="fc-legal__content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}
