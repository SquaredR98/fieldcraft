import Link from 'next/link';
import type { TemplateMeta } from '@/lib/templates';
import './styles.css';

interface TemplateCardProps {
  meta: TemplateMeta;
}

export function TemplateCard({ meta }: TemplateCardProps) {
  return (
    <Link href={`/templates/${meta.id}`} className="fc-tpl-card">
      <div className="fc-tpl-card__header">
        <span className="fc-tpl-card__badge">{meta.category}</span>
        <span className="fc-tpl-card__stats">
          {meta.fieldCount} fields &middot; {meta.sectionCount}{' '}
          {meta.sectionCount === 1 ? 'section' : 'sections'}
        </span>
      </div>
      <h3 className="fc-tpl-card__title">{meta.name}</h3>
      <p className="fc-tpl-card__desc">{meta.description}</p>
      <div className="fc-tpl-card__tags">
        {meta.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="fc-tpl-card__tag">{tag}</span>
        ))}
      </div>
    </Link>
  );
}
