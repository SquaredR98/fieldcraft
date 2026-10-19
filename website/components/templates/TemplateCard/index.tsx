import Link from 'next/link';
import type { TemplateMeta } from '@/lib/templates';
import './styles.css';

/*
 * One component, two treatments.
 *
 * The same seven fields were being rendered by this card AND by
 * hand-written markup in the homepage strip, with the templates page
 * about to become a third copy. A `variant` keeps the content in one
 * place:
 *
 *   card  a bordered, lifted plate that stands on its own
 *   cell  the same content with no border, radius or lift, for use
 *         inside a shared-border block where the CONTAINER owns all
 *         three — which is what keeps a group of six to two rounded
 *         corners per side rather than four per card
 */
interface TemplateCardProps {
  meta: TemplateMeta;
  variant?: 'card' | 'cell';
}

export function TemplateCard({ meta, variant = 'card' }: TemplateCardProps) {
  return (
    <Link
      href={`/templates/${meta.id}`}
      className="fc-tpl-card"
      data-variant={variant}
    >
      <div className="fc-tpl-card__header">
        <span className="fc-tpl-card__badge">{meta.category}</span>
        <span className="fc-tpl-card__stats">
          {meta.fieldCount} fields &middot; {meta.sectionCount}{' '}
          {meta.sectionCount === 1 ? 'section' : 'sections'}
        </span>
      </div>
      <h3 className="fc-tpl-card__title">{meta.name}</h3>
      <p className="fc-tpl-card__desc">{meta.description}</p>
      <div className="fc-tpl-card__foot">
        <div className="fc-tpl-card__tags">
          {meta.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="fc-tpl-card__tag">{tag}</span>
          ))}
        </div>
        <span className="fc-tpl-card__id">
          <span className="fc-tpl-card__id-pip" aria-hidden="true" />
          <span className="fc-tpl-card__id-text">{meta.id}</span>
        </span>
      </div>
    </Link>
  );
}
